import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HomeController, ProfileController } from 'src/Global/global.controller';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/Auth/auth.service';
import { AuthModule } from 'src/Auth/auth.module';
import { MailService } from 'src/Mail/mail.service';
import { UserService } from 'src/User/user.service';
import { ManagerController } from './manager.controller';

@Module({
  imports: [ AuthModule ],
  controllers: [ HomeController, ProfileController, ManagerController ],
  providers: [UserService, PrismaService, AuthService, JwtService, MailService],
  exports: [AuthService, UserService],
})
export class ManagerModule {}