import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PermissionTemplateControllerV2 } from './permission_template/permission_templateV2.controller';
import { PermissionTemplateService } from './permission_template/permission_template.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from '../administrator/audit/audit.service';
import { RoleManagementControllerV2 } from './role-management/role-managementV2.controller';
import { RoleManagementService } from './role-management/role-management.service';
import { UserManagementV2Module } from './user_management/user_managementV2.module';

@Module({
  imports: [
    // AuthModule,
    UserManagementV2Module,
  ],
  controllers: [PermissionTemplateControllerV2, RoleManagementControllerV2],
  providers: [
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtService,
    MailService,
    PermissionTemplateService,
    AuditService,
    RoleManagementService,
  ],
  exports: [AuthService, RoleManagementService],
})
export class ManagerV2Module {}
