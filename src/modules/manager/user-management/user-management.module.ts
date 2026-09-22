import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { AttachmentUploadService } from 'src/jobs/attachment-upload/attachment-upload.service';

@Module({
  imports: [AuthModule],
  controllers: [UserManagementController],
  providers: [
    UserManagementService,
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtService,
    MailService,
    AuditService,
    AttachmentUploadService,
  ],
  exports: [AuthService, UserManagementService],
})
export class UserManagementModule {}
