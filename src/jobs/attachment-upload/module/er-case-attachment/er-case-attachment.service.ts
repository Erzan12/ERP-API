import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  buildFileUrl,
  MINIO_BUCKETS,
  minioClient,
} from 'src/config/minio/minio.config';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { TRANSACTION_TYPE } from 'src/utils/constants/transaction-type.constants';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ErCaseAttachmentService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper for auth check
  private async assertHrAccess(userId: string) {
    const requestUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: { include: { person: true, position: true } },
        user_roles: true,
      },
    });

    if (!requestUser?.employee?.person) {
      throw new BadRequestException('User does not exist.');
    }

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return requestUser;
  }

  private async attachFilesForErCase(
    params: {
      files: Express.Multer.File[];
      transaction_type: string;
      case_id?: string;
      document_types?: string[];
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { files, transaction_type, case_id, document_types, user_id } =
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
        const fileName = `er-case-documents/${randomUUID()}.${extension}`;

        await minioClient.putObject(bucket, fileName, file.buffer, file.size, {
          'Content-Type': file.mimetype,
        });

        const fileUrl = buildFileUrl(bucket, fileName);

        return {
          transaction_type,
          // transaction_id,
          case_id,
          file_name: file.originalname,
          file_url: fileUrl,
          file_type: file.mimetype,
          file_size: file.size,
          // document_type: document_types?.[i] ?? null,
          uploaded_by: user_id,
        };
      }),
    );

    return prisma.hrErCaseAttachment.createMany({ data });
  }

  private async attachFilesForIrErReport(
    params: {
      files: Express.Multer.File[];
      transaction_type: string;
      intake_id?: string;
      document_types?: string[];
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { files, transaction_type, intake_id, document_types, user_id } =
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
        const fileName = `ir-er-documents/${randomUUID()}.${extension}`;

        await minioClient.putObject(bucket, fileName, file.buffer, file.size, {
          'Content-Type': file.mimetype,
        });

        const fileUrl = buildFileUrl(bucket, fileName);

        return {
          transaction_type,
          // transaction_id,
          intake_id,
          file_name: file.originalname,
          file_url: fileUrl,
          file_type: file.mimetype,
          file_size: file.size,
          // document_type: document_types?.[i] ?? null,
          uploaded_by: user_id,
        };
      }),
    );

    return prisma.hrErCaseAttachment.createMany({ data });
  }

  private async attachFilesForNTE(
    params: {
      file: Express.Multer.File;
      transaction_type: string;
      nte_id?: string;
      // document_types?: string;
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { file, transaction_type, nte_id, user_id } = params;

    // Guard: make sure a file was provided
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    // Guard: catch missing buffer early
    if (!file.buffer) {
      throw new BadRequestException(
        `File "${file.originalname}" has no buffer. Ensure multer is using memoryStorage.`,
      );
    }

    const bucket = MINIO_BUCKETS.DOCUMENTS;

    const extension =
      file.originalname.split('.').pop()?.toLowerCase() || 'bin';
    const fileName = `nte-documents/${randomUUID()}.${extension}`;

    await minioClient.putObject(bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const fileUrl = buildFileUrl(bucket, fileName);

    const data = {
      transaction_type,
      // transaction_id,
      nte_id,
      file_name: file.originalname,
      file_url: fileUrl,
      file_type: file.mimetype,
      file_size: file.size,
      // document_type: document_types?.[i] ?? null,
      uploaded_by: user_id,
    };

    return prisma.hrErCaseAttachment.createMany({ data });
  }

  async uploadErCaseDocs(
    disciplinaryCaseId: string,
    user: RequestUser,
    files: Express.Multer.File[],
  ) {
    await this.assertHrAccess(user.id);

    const disciplinaryCase = await this.prisma.hrErCase.findUnique({
      where: { id: disciplinaryCaseId },
    });

    if (!disciplinaryCase) {
      throw new NotFoundException('Disciplinary Case does not exists.');
    }

    const attachments = await this.attachFilesForErCase({
      files,
      transaction_type: TRANSACTION_TYPE.ER_CASE_DOC,
      case_id: disciplinaryCase.id,
      user_id: user.id,
    });

    return {
      status: 'success',
      message: 'Attachments for this Disciplinary Case uploaded.',
      attachments,
    };
  }

  async uploadIrErDocs(
    reportId: string,
    user: RequestUser,
    files: Express.Multer.File[],
  ) {
    await this.assertHrAccess(user.id);

    const existingReport = await this.prisma.hrErCaseIntake.findUnique({
      where: { id: reportId },
    });

    if (!existingReport) {
      throw new NotFoundException(
        'Incident or Employee report does not exists.',
      );
    }

    const attachments = await this.attachFilesForIrErReport({
      files,
      transaction_type: TRANSACTION_TYPE.IR_ER_DOC,
      intake_id: existingReport.id,
      user_id: user.id,
    });

    return {
      status: 'success',
      message: 'Attachments for this ER/IR uploaded.',
      attachments,
    };
  }

  async uploadNteDocs(
    nteId: string,
    user: RequestUser,
    file: Express.Multer.File,
  ) {
    await this.assertHrAccess(user.id);

    const existingNte = await this.prisma.hrErCaseNte.findUnique({
      where: { id: nteId },
    });

    if (!existingNte) {
      throw new NotFoundException('NTE does not exists.');
    }

    const attachment = await this.attachFilesForNTE({
      file,
      transaction_type: TRANSACTION_TYPE.NTE_DOC,
      nte_id: existingNte.id,
      user_id: user.id,
    });

    return {
      status: 'success',
      message: 'Attachments for this NTE uploaded.',
      attachment,
    };
  }
}
