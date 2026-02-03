import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PermissionTemplateController } from './permission_template/permission_template.controller';
import { PermissionTemplateService } from './permission_template/permission_template.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from '../administrator/audit/audit.service';

@Module({
  imports: [AuthModule],
  controllers: [PermissionTemplateController, UserController],
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
export class ManagerModule {}
