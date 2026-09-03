import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  buildFileUrl,
  MINIO_BUCKETS,
  minioClient,
} from '../../config/minio/minio.config';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttachmentUploadService {
  constructor(private readonly prisma: PrismaService) {}

  async attachFiles(
    params: {
      files: Express.Multer.File[];
      transaction_type: string;
      transaction_id: string;
      document_types?: string[];
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { files, transaction_type, transaction_id, document_types, user_id } =
      params;

    if (document_types && files.length !== document_types.length) {
      throw new BadRequestException(
        'Files and document types count must match',
      );
    }

    const bucket = MINIO_BUCKETS.DOCUMENTS;

    // Upload each file to MinIO and build attachment records
    const data = await Promise.all(
      files.map(async (file) => {
        // Guard: catch missing buffer early
        if (!file.buffer) {
          throw new BadRequestException(
            `File "${file.originalname}" has no buffer. Ensure multer is using memoryStorage.`,
          );
        }

        const extension =
          file.originalname.split('.').pop()?.toLowerCase() || 'bin';
        const fileName = `applicant-documents/${randomUUID()}.${extension}`;

        await minioClient.putObject(bucket, fileName, file.buffer, file.size, {
          'Content-Type': file.mimetype,
        });

        const fileUrl = buildFileUrl(bucket, fileName);

        return {
          transaction_type,
          transaction_id,
          file_name: file.originalname,
          file_path: fileUrl,
          mime_type: file.mimetype,
          file_size: file.size,
          // document_type: document_types?.[i] ?? null,
          created_by: user_id,
        };
      }),
    );

    return prisma.attachments.createMany({ data });
  }

  // with minion cloud storage
  async avatarUpload(
    params: {
      file?: Express.Multer.File;
      transaction_type: string;
      transaction_id: string;
      document_type?: string;
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;

    const { file, transaction_type, transaction_id, user_id } = params;

    if (!file) {
      return null;
    }

    const avatarOptional: string | null = null;

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image type');
    }

    const bucket = MINIO_BUCKETS.AVATARS;

    const extension =
      file.originalname.split('.').pop()?.toLowerCase() || 'jpg';

    const fileName = `avatars/${randomUUID()}.${extension}`;

    try {
      await minioClient.putObject(bucket, fileName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });
    } catch (error) {
      console.error('MinIO upload failed:', error);

      throw new InternalServerErrorException('Failed to upload avatar');
    }

    const avatarUrl = `${process.env.MINIO_PUBLIC_URL}/${bucket}/${fileName}`;

    const user = await prisma.user.update({
      where: {
        id: transaction_id,
      },

      data: {
        avatar: buildFileUrl(bucket, fileName),
      },

      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    await prisma.attachments.create({
      data: {
        transaction_type,
        transaction_id,
        file_name: file.originalname,
        file_path: `${avatarUrl}`,
        mime_type: file.mimetype,
        file_size: file.size,
        created_by: user_id,
      },
    });

    return {
      ...user,
      avatar_url: avatarOptional,
    };
  }
}
