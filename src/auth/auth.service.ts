import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { mapRolesToRequestUser } from 'src/utils/helpers/reusable-group-role-permisison.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  //For first time log in password reset with token from user or person registration/creation
  async resetPasswordWithToken(
    dto: ResetPasswordWithTokenDto,
    token: string,
    // ipAddress?: string,
    // userAgent?: string,
  ) {
    if (!token) {
      throw new BadRequestException('Reset token is required.');
    }

    // find the user token
    const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
      where: { password_token: token },
      include: { user: true },
    });

    if (!passwordResetToken) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    // Check if token was already used
    if (passwordResetToken.isUsed) {
      throw new BadRequestException('Reset token has already been used.');
    }

    // optional: check expiration
    if (passwordResetToken.expires_at < new Date()) {
      throw new BadRequestException('Reset token has expired.');
    }

    //validate if the password is the same as the old password
    const user = passwordResetToken.user;

    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password, Please add a new one!',
      );
    }

    //hashed the new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Update the user's password
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword, // your hashed new password
        require_reset: 0, // disable require_reset flag
        // password_reset: '', // clear any reset token/flag
      },
    });

    // const passwordToken = await this.prisma.passwordResetToken.findUnique({
    //   where: { id: passwordResetToken.id },
    // });

    // if (!passwordToken?.is_used) {
    //   await this.prisma.passwordResetToken.update({
    //     where: { id: passwordresetToken.id },
    //     data: { is_used: true },
    //   });
    // }

    await this.prisma.passwordResetToken.update({
      where: { id: passwordResetToken.id },
      data: {
        isUsed: true,
      },
    });

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
      },
    };
  }

  //generate reset token
  async generateResetToken(userId: string) {
    // Delete old unused tokens
    await this.prisma.passwordResetToken.deleteMany({
      where: {
        user_id: userId,
        isUsed: false,
      },
    });

    const tokenKey = crypto.randomBytes(64).toString('hex');

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days
    );

    const token = await this.prisma.passwordResetToken.create({
      data: {
        user_id: userId,
        password_token: tokenKey,
        expires_at: expiresAt,
      },
    });

    return {
      status: 'success',
      message: 'Reset Token generated successfully',
      token,
    };
  }

  //v3 log in with validateUser - to validate the user log in request if the user is a valid user and existed in the database if yes then jwt token will be generated
  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        employee: true,
        user_roles: {
          where: { isActive: true },
          include: {
            role: {
              include: {
                role_permissions: {
                  where: { isActive: true },
                  include: {
                    sub_module: true,
                  },
                },
              },
            },
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

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { username, password } = loginDto;

    const userAudit = await this.prisma.user.findUnique({
      where: { username },
      include: {
        user_roles: {
          include: {
            role: true,
            user_permissions: {
              include: {
                role_permission: {
                  include: {
                    sub_module: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userAudit || !(await bcrypt.compare(password, userAudit.password))) {
      //log failed login attempt
      await this.auditService.logAuth(
        'LOGIN_FAILED',
        undefined,
        ipAddress,
        userAgent,
        false,
        `Failed login attempt for username: ${username}`,
      );

      throw new UnauthorizedException('Invalid credentials');
    }

    const userValidate = await this.validateUser(username, password);

    if (userValidate.require_reset === 1) {
      // return {
      //   status: 'password_require_reset',
      //   message: 'You must reset your password first for first time login!',
      //   userId: userValidate.id,
      //   token: string;
      // };
      throw new BadRequestException(
        'You must reset your password first for first time login!',
      );
    }

    if (userValidate.isActive !== true) {
      throw new BadRequestException('Your account was deactivated.');
    }

    // Reset any pending password reset token
    if (userValidate.password_reset && userValidate.password_reset !== '') {
      await this.prisma.user.update({
        where: { id: userValidate.id },
        data: { password_reset: '' },
      });
    }

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: { user_id: userValidate.id },
    });

    if (!resetToken) {
      throw new BadRequestException('No token assigned to this user.');
    }

    const issuedAt = Math.floor(Date.now() / 1000);

    const payload = {
      userUUID: userValidate.id,
      tokenVersion: userValidate.token_version,
      department_id: userValidate.employee.department_id,
      name: userValidate.username,
      issuedAt: issuedAt,
    };

    //JWT service token is JWT Secret Key in .env with Payload from user name role id and permissions, the logic handling is in jwt.strategy.ts
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '8h',
    });

    // Update last login
    await this.prisma.user.update({
      where: { id: userValidate.id },
      data: {
        last_login: new Date(), // set to current timestamp
      },
    });

    const requestUser: RequestUser = {
      id: userValidate.id,
      email: userValidate.email,
      department_id: userValidate.employee.department_id,
      security_clearance_level: userValidate.security_clearance_level ?? 0,
      roles: mapRolesToRequestUser(userValidate.user_roles),
    };

    await this.auditService.logAuth(
      'LOGIN',
      requestUser,
      ipAddress,
      userAgent,
      true,
    );

    const isNewAccount =
      password === 'avegabros' ||
      userValidate.password_reset ||
      userValidate.require_reset === 1;

    return {
      status: 1,
      message: 'Login successful',
      token,
      // payload,
      ...(isNewAccount && { new_account: 1 }),
    };
  }

  async logout(
    requestUser: RequestUser,
    ipAddress?: string,
    userAgent?: string,
  ) {
    await this.prisma.user.update({
      where: { id: requestUser.id },
      data: {
        token_version: { increment: 1 },
      },
    });
    // console.log('id of user', logOutUser.id);

    await this.auditService.logAuth(
      'LOGOUT',
      requestUser,
      ipAddress,
      userAgent,
      true,
    );

    return { message: 'User logged out successfully' };
  }

  async getUser(requestUser: RequestUser) {
    if (!requestUser?.id) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: requestUser.id }, // ownership enforced here
      include: {
        employee: {
          include: {
            person: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
            division: true,
            company: true,
            employment_status: true,
            position: true,
          },
        },
        user_roles: {
          where: { isActive: true },
          include: {
            role: {
              include: {
                role_permissions: {
                  where: { isActive: true },
                  include: {
                    sub_module: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.isActive !== true) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    const employee = user.employee;

    return {
      status: 'success',
      message: 'User is validated successfully',
      data: {
        id: user.id,
        full_name: [
          employee.person.first_name,
          employee.person.middle_name,
          employee.person.last_name,
        ]
          .filter(Boolean)
          .join(' '),
        email: user.email,
        department: employee.department
          ? {
              id: employee.department.id,
              name: employee.department.name,
            }
          : null,
        company: employee.company.name,
        division: employee.division.name,
        position: employee.position.name,
        security_clearance_level: user.security_clearance_level ?? 0,
        // roles: user.user_roles.map((ur) => ({
        //     id: ur.role?.id ?? 0,
        //     role_name: ur.role?.name ?? 'Unknown Role',
        //     // module: {
        //     //   id: ur.role.module?.id,
        //     //   name: ur.role.module?.name,
        //     // },
        //     sub_modules: ur.user_permissions.map((up) => ({
        //     name: up.role_permission?.sub_module?.name ?? 'unknown', // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
        //     // action: up.role_permission?.action ?? 'unknown',
        //     // status: true, // if you have a field for it, use it
        //     })),
        // })),
        roles: user.user_roles.map((ur) => {
          const uniqueSubmodules = [
            ...new Map(
              ur.role.role_permissions.map((rp) => [
                rp.sub_module.id,
                {
                  id: rp.sub_module.id,
                  name: rp.sub_module.name,
                },
              ]),
            ).values(),
          ];
          return {
            id: ur.role?.id ?? 0,
            role_name: ur.role?.name ?? 'Unknown Role',
            isActive: ur.isActive ?? 'false',
            sub_modules: uniqueSubmodules,
          };
        }),
      },
    };
  }
}
