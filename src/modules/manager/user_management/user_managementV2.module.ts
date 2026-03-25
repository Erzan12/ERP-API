import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/jobs/mail/mail.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { UserManagementService } from './user_management.service';
import { UserManagementControllerV2 } from './user_managementV2.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserManagementControllerV2],
  providers: [
    UserManagementService,
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtService,
    MailService,
    AuditService,
  ],
  exports: [AuthService, UserManagementService],
})
export class UserManagementV2Module {}
