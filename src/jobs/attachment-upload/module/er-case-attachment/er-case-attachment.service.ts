import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  buildFileUrl,
  extractObjectName,
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
      nte_id: string;
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { file, transaction_type, nte_id, user_id } = params;

    if (!file) {
      throw new BadRequestException('File is required.');
    }

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

    const fileData = {
      file_name: file.originalname,
      file_url: buildFileUrl(bucket, fileName),
      file_type: file.mimetype,
      file_size: file.size,
      uploaded_by: user_id,
    };

    try {
      return await prisma.hrErCaseAttachment.upsert({
        where: { nte_id },
        create: { ...fileData, transaction_type, nte_id },
        update: { ...fileData, created_at: new Date() }, // optional
      });
    } catch (err) {
      // DB failed: don't leave the just-uploaded object orphaned
      await minioClient.removeObject(bucket, fileName).catch(() => undefined);
      throw err;
    }
  }

  private async attachFilesForExplanation(
    params: {
      file: Express.Multer.File;
      transaction_type: string;
      explanation_id: string;
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { file, transaction_type, explanation_id, user_id } = params;

    // Guard: make sure a file was provided
    if (!file) {
      throw new BadRequestException('File is required');
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
    const fileName = `written-explaination-documents/${randomUUID()}.${extension}`;

    await minioClient.putObject(bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const fileUrl = buildFileUrl(bucket, fileName);

    const data = {
      transaction_type,
      explanation_id,
      file_name: file.originalname,
      file_url: fileUrl,
      file_type: file.mimetype,
      file_size: file.size,
      uploaded_by: user_id,
    };

    return prisma.hrErCaseAttachment.create({ data });
  }

  private async attachFilesForCaseHearing(
    params: {
      files: Express.Multer.File[];
      transaction_type: string;
      hearing_id: string;
      document_types?: string[];
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { files, transaction_type, hearing_id, document_types, user_id } =
      params;

    if (document_types && files.length !== document_types.length) {
      throw new BadRequestException(
        'Files and document types count must match',
      );
    }

    const bucket = MINIO_BUCKETS.DOCUMENTS;

    // Upload each file to MinIO and build attachment records
    const data = await Promise.all(
      files.map(async (files) => {
        // Guard: catch missing buffer early
        if (!files.buffer) {
          throw new BadRequestException(
            `File "${files.originalname}" has no buffer. Ensure multer is using memoryStorage.`,
          );
        }

        const extension =
          files.originalname.split('.').pop()?.toLowerCase() || 'bin';
        const fileName = `hearing-documents/${randomUUID()}.${extension}`;

        await minioClient.putObject(
          bucket,
          fileName,
          files.buffer,
          files.size,
          {
            'Content-Type': files.mimetype,
          },
        );

        const fileUrl = buildFileUrl(bucket, fileName);

        return {
          transaction_type,
          // transaction_id,
          hearing_id,
          file_name: files.originalname,
          file_url: fileUrl,
          file_type: files.mimetype,
          file_size: files.size,
          // document_type: document_types?.[i] ?? null,
          uploaded_by: user_id,
        };
      }),
    );

    return prisma.hrErCaseAttachment.createMany({ data });
  }

  private async attachFilesForDecision(
    params: {
      file: Express.Multer.File;
      transaction_type: string;
      decision_id: string;
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { file, transaction_type, decision_id, user_id } = params;

    // Guard: make sure a file was provided
    if (!file) {
      throw new BadRequestException('File is required');
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
    const fileName = `notice-of-decision-documents/${randomUUID()}.${extension}`;

    await minioClient.putObject(bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const fileUrl = buildFileUrl(bucket, fileName);

    const data = {
      transaction_type,
      decision_id,
      file_name: file.originalname,
      file_url: fileUrl,
      file_type: file.mimetype,
      file_size: file.size,
      uploaded_by: user_id,
    };

    return prisma.hrErCaseAttachment.create({ data });
  }

  private async attachFilesForDeductAuthority(
    params: {
      file: Express.Multer.File;
      transaction_type: string;
      decision_payroll_deduction_id: string;
      user_id?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const { file, transaction_type, decision_payroll_deduction_id, user_id } =
      params;

    // Guard: make sure a file was provided
    if (!file) {
      throw new BadRequestException('File is required');
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
    const fileName = `authority-to-deduct-documents/${randomUUID()}.${extension}`;

    await minioClient.putObject(bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const fileUrl = buildFileUrl(bucket, fileName);

    const data = {
      transaction_type,
      decision_payroll_deduction_id,
      file_name: file.originalname,
      file_url: fileUrl,
      file_type: file.mimetype,
      file_size: file.size,
      uploaded_by: user_id,
    };

    return prisma.hrErCaseAttachment.create({ data });
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

  async deleteErCaseDoc(
    disciplinaryCaseId: string,
    attachmentId: string,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    const attachment = await this.prisma.hrErCaseAttachment.findFirst({
      where: {
        id: attachmentId,
        transaction_type: TRANSACTION_TYPE.ER_CASE_DOC,
        case_id: disciplinaryCaseId,
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment does not exists on this case.');
    }

    // Delete DB record first
    await this.prisma.hrErCaseAttachment.delete({
      where: { id: attachment.id },
    });

    // Then remove the object from MinIO ()
    try {
      const objectName = extractObjectName(MINIO_BUCKETS.DOCUMENTS, attachment.file_url);
      await minioClient.removeObject(MINIO_BUCKETS.DOCUMENTS, objectName);
    } catch (e) {
      console.warn(
        `Failed to remove MinIO object for attachment ${attachment.id}: ${e}`,
      );
    }

    return {
      status: 'success',
      message: 'Attachment deleted.',
      attachment_id: attachment.id,
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
      include: { attachment: true },
    });

    if (!existingNte) {
      throw new NotFoundException('NTE does not exists.');
    }

    const oldAttachment = existingNte.attachment;

    const attachment = await this.attachFilesForNTE({
      file,
      transaction_type: TRANSACTION_TYPE.NTE_DOC,
      nte_id: existingNte.id,
      user_id: user.id,
    });

    // Only after the new file and row are safely in place
    if (oldAttachment) {
      try {
        const oldObjectName = extractObjectName(
          MINIO_BUCKETS.DOCUMENTS,
          oldAttachment.file_url,
        );
        await minioClient.removeObject(MINIO_BUCKETS.DOCUMENTS, oldObjectName);
      } catch (e) {
        console.warn(
          `Failed to remove old MinIO object for attachment ${oldAttachment.id}: ${e}`,
        );
      }
    }

    return {
      status: 'success',
      message: oldAttachment
        ? 'NTE attachment replaced.'
        : 'Attachments for this NTE uploaded.',
      attachment,
    };
  }

  async deleteNteDoc (
    nteId: string,
    attachmentId: string,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    const attachment = await this.prisma.hrErCaseAttachment.findFirst({
      where: {
        id: attachmentId,
        transaction_type: TRANSACTION_TYPE.NTE_DOC,
        nte_id: nteId,
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment does not exists on this case.');
    }

    // Delete DB record first
    await this.prisma.hrErCaseAttachment.delete({
      where: { id: attachment.id },
    });

    // Then remove the object from MinIO ()
    try {
      const objectName = extractObjectName(MINIO_BUCKETS.DOCUMENTS, attachment.file_url);
      await minioClient.removeObject(MINIO_BUCKETS.DOCUMENTS, objectName);
    } catch (e) {
      console.warn(
        `Failed to remove MinIO object for attachment ${attachment.id}: ${e}`,
      );
    }

    return {
      status: 'success',
      message: 'Attachment deleted',
      attachment_id: attachment.id,
    };
  }

  async uploadExplanationDocs(
    explanationId: string,
    user: RequestUser,
    file: Express.Multer.File,
  ) {
    await this.assertHrAccess(user.id);

    const existingExplanation =
      await this.prisma.hrErCaseExplanation.findUnique({
        where: { id: explanationId },
      });

    if (!existingExplanation) {
      throw new NotFoundException('Written Explaination does not exists.');
    }

    const attachment = await this.attachFilesForExplanation({
      file,
      transaction_type: TRANSACTION_TYPE.WRITTEN_EXPLANATION_DOC,
      explanation_id: existingExplanation.id,
      user_id: user.id,
    });

    return {
      status: 'success',
      message: 'Attachments for this Written Explanation uploaded.',
      attachment,
    };
  }

  async uploadHearingDocs(
    hearingId: string,
    user: RequestUser,
    files: Express.Multer.File[],
  ) {
    await this.assertHrAccess(user.id);

    const existingHearing = await this.prisma.hrErCaseHearing.findUnique({
      where: { id: hearingId },
    });

    if (!existingHearing) {
      throw new NotFoundException('Written Explaination does not exists.');
    }

    const attachments = await this.attachFilesForCaseHearing({
      files,
      transaction_type: TRANSACTION_TYPE.ADMIN_HEARING_DOC,
      hearing_id: existingHearing.id,
      user_id: user.id,
    });

    return {
      status: 'success',
      message: 'Attachments for this Case Hearing uploaded.',
      attachments,
    };
  }

  async uploadDecisionDocs(
    decisionId: string,
    user: RequestUser,
    file: Express.Multer.File,
  ) {
    await this.assertHrAccess(user.id);

    const existingDecision = await this.prisma.hrErCaseDecision.findUnique({
      where: { id: decisionId },
    });

    if (!existingDecision) {
      throw new NotFoundException('Written Explaination does not exists.');
    }

    const attachment = await this.attachFilesForDecision({
      file,
      transaction_type: TRANSACTION_TYPE.WRITTEN_EXPLANATION_DOC,
      decision_id: existingDecision.id,
      user_id: user.id,
    });

    return {
      status: 'success',
      message: 'Attachments for this Written Explanation uploaded.',
      attachment,
    };
  }

  async uploadAuthorityToDeductDocs(
    deductPayrollId: string,
    user: RequestUser,
    file: Express.Multer.File,
  ) {
    await this.assertHrAccess(user.id);

    const existingDeductAuthority =
      await this.prisma.hrErNodPayrollAdjustment.findUnique({
        where: { id: deductPayrollId },
      });

    if (!existingDeductAuthority) {
      throw new NotFoundException('Payroll adjustment does not exists.');
    }

    const attachment = await this.attachFilesForDeductAuthority({
      file,
      transaction_type: TRANSACTION_TYPE.DEDUCT_AUTHORITY_DOC,
      decision_payroll_deduction_id: existingDeductAuthority.id,
      user_id: user.id,
    });

    return {
      status: 'success',
      message: 'Attachments for Authority to deduct uploaded.',
      attachment,
    };
  }
}
