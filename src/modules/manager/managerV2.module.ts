import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PermissionTemplateControllerV2 } from './permission_template/controllers/permission_templateV2.controller';
import { PermissionTemplateService } from './permission_template/permission_template.service';
import { UserManagementControllerV2 } from './user_management/controllers/user_managementV2.controller';
import { UserManagementService } from './user_management/user_management.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from '../administrator/audit/audit.service';

@Module({
  imports: [AuthModule],
  controllers: [PermissionTemplateControllerV2, UserManagementControllerV2],
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
export class ManagerV2Module {}
