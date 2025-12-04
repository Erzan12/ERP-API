import { Module } from '@nestjs/common';
import { MailService } from '../Mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../Components/middleware/jwt.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  imports:[],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, JwtService, MailService, ConfigService],
  exports: [ AuthModule, JwtStrategy ],
})
export class AuthModule {}

