import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { MailService } from 'src/jobs/mail/mail.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    JwtService,
    MailService,
    ConfigService,
  ],
  exports: [AuthModule, JwtStrategy],
})
export class AuthModule {}
