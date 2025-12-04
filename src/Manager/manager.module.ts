import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/Auth/auth.service';
import { AuthModule } from 'src/Auth/auth.module';
import { MailService } from 'src/Mail/mail.service';
import { UserService } from './user/user.service';
import { PermissionTemplateController } from './permission_template/permission_template.controller';
import { PermissionTemplateService } from './permission_template/permission_template.service';
import { UserController } from './user/user.controller';
import { JwtStrategy } from 'src/Components/middleware/jwt.strategy';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  imports: [ AuthModule ],
  controllers: [ PermissionTemplateController, UserController ],
  providers: [UserService, PrismaService, AuthService, JwtStrategy, JwtService, MailService, PermissionTemplateService],
  exports: [AuthService, UserService],
})
export class ManagerModule {}