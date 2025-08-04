import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from '../Mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../Components/middleware/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports:[],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,JwtStrategy, JwtService, MailService, ConfigService],
  exports: [ AuthModule, JwtStrategy ],
})
export class AuthModule {}

