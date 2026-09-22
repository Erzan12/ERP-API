import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AttachmentUploadService } from './attachment-upload.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ErCaseAttachmentController } from './er-case-attachment/er-case-attachment.controller';
import { ErCaseAttachmentService } from './er-case-attachment/er-case-attachment.service';

@Module({
  imports: [AuthModule],
  providers: [PrismaService, AttachmentUploadService, ErCaseAttachmentService],
  controllers: [ErCaseAttachmentController],
})
export class AttachmentUploadModule {}

