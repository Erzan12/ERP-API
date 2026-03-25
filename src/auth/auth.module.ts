import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { JwtStrategy } from '../middleware/jwt/jwt.strategy';
import { MailService } from 'src/jobs/mail/mail.service';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { CaslAbilityService } from 'src/middleware/casl/casl.service';
import { CaslModule } from 'src/middleware/casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    JwtService,
    MailService,
    ConfigService,
    AuditService,
    CaslAbilityService,
  ],
  exports: [AuthModule, JwtStrategy],
})
export class AuthModule {}
