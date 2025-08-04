import { ConflictException, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    //For first time log in password reset with token from user or person registration/creation
    async resetPasswordWithToken(dto: ResetPasswordWithTokenDto, token: string) {
        const { newPassword } = dto;

        if (!token) {
            throw new BadRequestException('Reset token is required.');
        }

        // find the user token
        const passwordresetToken = await this.prisma.passwordResetToken.findFirst({
            where: { password_token: token },
            include: { user: true },
        });

        if (!passwordresetToken) {
            throw new BadRequestException('Invalid or expired reset token.');
        }

        // Check if token was already used
        if (passwordresetToken.is_used) {
            throw new BadRequestException('Reset token has already been used.');
        }

        // optional: check expiration
        if (passwordresetToken.expires_at < new Date()) {
            throw new BadRequestException('Reset token has expired.');
        }

        //validate if the password is the same as the old password
        const user = passwordresetToken.user;
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new BadRequestException('New password cannot be the same as the old password, Please add a new one!')
        }
        
        //hashed the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,       // your hashed new password
                require_reset: 0,               // disable require_reset flag
                must_reset_password: false,     // also disable must_reset_password
                password_reset: '',             // clear any reset token/flag
            },
        });

        const passwordToken = await this.prisma.passwordResetToken.findUnique({
            where: { id: passwordresetToken.id },
        });

        if (!passwordToken?.is_used) {
        await this.prisma.passwordResetToken.update({
            where: { id: passwordresetToken.id },
            data: { is_used: true },
        });
        }

        await this.prisma.passwordResetToken.update({
            where: { id: passwordresetToken.id },
            data: {
                is_used: true,
            }
        })

        //delete the token or mark it used

        //<---- this section will delete the generated reset token in db upon changing for your new password -->
        // await this.prisma.userToken.delete({ where: { id: userToken.id } });

        return {
            status: 'success',
            message: `Password has been reset. You may now log in!`,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
            }
        };
    }

    //v3 log in with validateUser 
    async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
        where: { username },
        include: {
            user_roles: {
            include: {
                role: {
                include: {
                    role_permissions: {
                    include: {
                        permission: true,
                    },
                    },
                },
                },
                module: true,
            },
            },
        },
        });

        if (!user) throw new UnauthorizedException('User not found');

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Entered password:', password);
        console.log('Stored hashed password:', user.password);
        console.log('Password valid?', isPasswordValid);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

        return user;
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        const user = await this.validateUser(username, password);

        if (user.must_reset_password) {
        return {
            status: 'password_require_reset',
            message: 'You must reset your password before proceeding',
            userId: user.id,
        };
        }

        if (user.stat !== 1) {
            throw new BadRequestException('Your account was deactivated.');
        }

        // Reset any pending password reset token
        if (user.password_reset && user.password_reset !== '') {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password_reset: '' },
        });
        }

        const resetToken = await this.prisma.passwordResetToken.findFirst({
            where: { user_id: user.id },
        });

        if (!resetToken) {
            throw new BadRequestException('No token assigned to this user.');
        }

        const issuedAt = Math.floor(Date.now() / 1000);

        const payload = {
            sub: user.id,
            name: user.username,
            iat: issuedAt,
        };

        //JWT service token is JWT Secret Key in .env with Payload from user name role id and permissions, the logic handling is in jwt.strategy.ts
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h',
        });

        // Update last login
        await this.prisma.user.update({
        where: { id: user.id },
        data: {
            last_login: new Date(), // set to current timestamp
        },
        });
        
        const isNewAccount = password === 'avegabros' || user.password_reset || user.require_reset === 1;

        return {
        status: 1,
        message: 'Login successful',
        token,
        payload,
        ...(isNewAccount && { new_account: 1 }),
        };
    }
}
