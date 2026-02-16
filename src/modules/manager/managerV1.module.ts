import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PermissionTemplateControllerV1 } from './permission_template/controllers/permission_templateV1.controller';
import { PermissionTemplateService } from './permission_template/permission_template.service';
import { UserControllerV1 } from './user/controllers/userV1.controller';
import { UserService } from './user/user.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from '../administrator/audit/audit.service';

@Module({
  imports: [AuthModule],
  controllers: [PermissionTemplateControllerV1, UserControllerV1],
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
export class ManagerV1Module {}
