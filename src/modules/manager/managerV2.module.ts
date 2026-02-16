import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PermissionTemplateControllerV2 } from './permission_template/controllers/permission_templateV2.controller';
import { PermissionTemplateService } from './permission_template/permission_template.service';
import { UserControllerV2 } from './user/controllers/userV2.controller';
import { UserService } from './user/user.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from '../administrator/audit/audit.service';

@Module({
  imports: [AuthModule],
  controllers: [PermissionTemplateControllerV2, UserControllerV2],
  providers: [
    UserService,
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtService,
    MailService,
    PermissionTemplateService,
    AuditService
  ],
  exports: [AuthService, UserService],
})
export class ManagerV2Module {}
