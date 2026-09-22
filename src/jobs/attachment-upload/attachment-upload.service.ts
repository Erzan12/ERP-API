import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SUPABASE_BUCKETS, buildFileUrl, supabase } from 'src/config/supabase/supabase.config';

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

    const bucket = SUPABASE_BUCKETS.DOCUMENTS;

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

        const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new InternalServerErrorException(
                `Failed to uplaod "${file.originalname}": ${error.message}`,
            );
        }

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

    const bucket = SUPABASE_BUCKETS.AVATARS;

    const extension =
      file.originalname.split('.').pop()?.toLowerCase() || 'jpg';

    const fileName = `avatars/${randomUUID()}.${extension}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (error) {
      console.error('MinIO upload failed:', error);
      throw new InternalServerErrorException('Failed to upload avatar');
    }

    const avatarUrl = buildFileUrl(bucket, fileName);

    const user = await prisma.user.update({
      where: {
        id: transaction_id,
      },
      data: {
        avatar: avatarUrl,
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
