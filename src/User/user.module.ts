import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from '../Components/middleware/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/Auth/auth.service';
import { AuthModule } from 'src/Auth/auth.module';
import { MailService } from 'src/Mail/mail.service';

@Module({
    imports: [AuthModule],
    controllers: [UserController],
    providers: [UserService, PrismaService, JwtStrategy, AuthService, JwtService, MailService],
    exports:[UserModule,AuthService,UserService],
})
export class UserModule {
}
