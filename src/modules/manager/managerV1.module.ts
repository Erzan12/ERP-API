import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PermissionTemplateControllerV1 } from './permission_template/controllers/permission_templateV1.controller';
import { PermissionTemplateService } from './permission_template/permission_template.service';
import { UserManagementControllerV1 } from './user_management/controllers/user_managementV1.controller';
import { UserManagementService } from './user_management/user_management.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from '../administrator/audit/audit.service';

@Module({
  imports: [AuthModule],
  controllers: [PermissionTemplateControllerV1, UserManagementControllerV1],
  providers: [
    UserManagementService,
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtService,
    MailService,
    PermissionTemplateService,
    AuditService,
  ],
  exports: [AuthService, UserManagementService],
})
export class ManagerV1Module {}
