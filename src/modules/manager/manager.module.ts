import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PermissionTemplateController } from './permission-template/permission-template.controller';
import { PermissionTemplateService } from './permission-template/permission-template.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from '../administrator/audit/audit.service';
import { RoleManagementController } from './role-management/role-management.controller';
import { RoleManagementService } from './role-management/role-management.service';

@Module({
  imports: [AuthModule],
  controllers: [PermissionTemplateController, RoleManagementController],
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
export class ManagerModule {}
