import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PermissionTemplateControllerV2 } from './permission_template/controllers/permission_templateV2.controller';
import { PermissionTemplateService } from './permission_template/permission_template.service';
import { UserAccountControllerV2 } from './user_account/controllers/user_accountV2.controller';
import { UserAccountService } from './user_account/user_account.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from '../administrator/audit/audit.service';

@Module({
  imports: [AuthModule],
  controllers: [PermissionTemplateControllerV2, UserAccountControllerV2],
  providers: [
    UserAccountService,
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtService,
    MailService,
    PermissionTemplateService,
    AuditService
  ],
  exports: [AuthService, UserAccountService],
})
export class ManagerV2Module {}
