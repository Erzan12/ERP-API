import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  Inject,
  forwardRef,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import {
  ResetPasswordWithTokenDto,
  ResendInvitationTokenDto,
  VerifyForgotPasswordDto,
  ForgotPasswordDto,
} from './dto/reset-password-with-token.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { mapRolesToRequestUser } from 'src/utils/helpers/reusable-group-role-permisison.helper';
import { MailService } from 'src/jobs/mail/mail.service';
import {
  generateOtp,
  getOtpExpiration,
} from 'src/utils/constants/otp-verification.constants';
import { UserManagementService } from 'src/modules/manager/user_management/user_management.service';
import { ActionEntry } from './type/action-entry.type';
import { OtpPurposeTemplate } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
    private readonly mailService: MailService,

    @Inject(forwardRef(() => UserManagementService))
    private readonly userManagementService: UserManagementService,
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

    await this.prisma.passwordHistory.create({
      data: {
        user_id: updatedUser.id,
        created_by: user.id,
        password_hash: updatedUser.password,
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

  async resendInvitation(dto: ResendInvitationTokenDto, user: RequestUser) {
    const actingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: {
          include: {
            person: true,
            position: true,
          },
        },
        user_roles: true,
      },
    });

    if (!actingUser || !actingUser.employee || !actingUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const admin = `${actingUser.employee.person.first_name} ${actingUser.employee.person.last_name}`;
    const adminPos = actingUser.employee.position?.name;

    // scalable approach
    const allowedRoles = ['Administrator', 'Super Administrator', 'Manager'];
    const isAdmin = actingUser.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!isAdmin) {
      throw new ForbiddenException('User is not allowed create User Account');
    }

    const invitedUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!invitedUser) {
      throw new NotFoundException('User not found or email does not exist');
    }

    if (invitedUser.require_reset === 0) {
      throw new BadRequestException(
        'User has already completed first log in reset password.',
      );
    }

    // Call Auth service to regenerate token
    const resetToken = await this.generateResetToken(invitedUser.id);
    // const { password_token } = token;

    await this.mailService.sendResetTokenEmail(
      invitedUser.email,
      invitedUser.username,
      // newUser.password,
      resetToken.token.password_token,
    );

    return {
      status: 'success',
      message: `Invitation resent to ${invitedUser.email}`,
      user_id: invitedUser.id,
      reset_token: resetToken.token,
      user_name: invitedUser.username,
      updated_by: {
        name: admin,
        position: adminPos,
      },
    };
  }

  //forgot password
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userManagementService.findByIdentifier(
      dto.identifier,
    );

    if (!user) {
      return { message: 'If account exists, OTP sent' };
    }

    const existingOtp = await this.prisma.otpVerification.findFirst({
      where: {
        user_id: user.id,
        purpose: OtpPurposeTemplate.forgot_password,
        is_used: false,
        expires_at: {
          gt: new Date(),
        },
      },
    });

    if (existingOtp) {
      throw new BadRequestException(
        'An OTP has already been sent. Please wait until it expires.',
      );
    }

    const generatedOtp = await this.prisma.otpVerification.create({
      data: {
        employee_id: user.employee_id,
        user_id: user.id,
        code: generateOtp(),
        purpose: OtpPurposeTemplate.forgot_password,
        expires_at: getOtpExpiration(),
      },
    });

    try {
      await this.mailService.sendOtp(user.email, generateOtp());
    } catch {
      throw new InternalServerErrorException('Failed to send OTP email.');
    }

    return {
      status: 'success',
      message: 'Generated OTP successfully',
      generatedOtp,
    };
  }

  async verifyForgotPassword(dto: VerifyForgotPasswordDto) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.identifier);

    const user = isEmail
      ? await this.prisma.user.findUnique({
          where: { email: dto.identifier },
        })
      : await this.prisma.user.findFirst({
          where: {
            employee: {
              mobile_numbers: {
                some: {
                  mobile_number: dto.identifier,
                },
              },
            },
          },
        });

    if (!user) throw new BadRequestException('Invalid request');

    const otpRecord = await this.prisma.otpVerification.findFirst({
      where: {
        user_id: user.id,
        code: dto.otp,
        purpose: OtpPurposeTemplate.forgot_password,
        is_used: false,
        expires_at: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // password history check
    const history = await this.prisma.passwordHistory.findMany({
      where: { user_id: user.id },
      take: 5,
      orderBy: { created_at: 'desc' },
    });

    for (const h of history) {
      const reused = await bcrypt.compare(dto.newPassword, h.password_hash);
      if (reused) {
        throw new BadRequestException('Password already used before');
      }
    }

    if (await bcrypt.compare(dto.newPassword, user.password)) {
      throw new BadRequestException('Same as current password');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction(async (tx) => {
      await tx.passwordHistory.create({
        data: {
          user_id: user.id,
          password_hash: user.password,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });

      await tx.otpVerification.update({
        where: { id: otpRecord.id },
        data: {
          is_used: true,
          used_at: new Date(),
        },
      });
    });

    return { message: 'Password reset successful' };
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
      Date.now() + 1000 * 60 * 60 * 24 * 1, // 1 day
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
          where: { is_active: true },
          include: {
            // role: {
            //   include: {
            //     role_permissions: {
            //       where: { is_active: true },
            //       include: {
            //         sub_module_permission: {
            //           include: {
            //             sub_module: true,
            //           }
            //         }
            //       },
            //     },
            //   },
            // },
            user_permissions: {
              include: {
                role_permission: {
                  include: {
                    sub_module_permission: {
                      include: {
                        sub_module: true,
                      },
                    },
                  },
                },
                sub_module_permission: {
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
                    sub_module_permission: {
                      include: {
                        sub_module: true,
                      },
                    },
                  },
                },
                sub_module_permission: {
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

    if (userValidate.is_active !== true) {
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
      department_id: userValidate.employee.department_id ?? '',
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
      department_id: userValidate.employee.department_id ?? '',
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

    // Toggle set to false if you don't want slug/code fields in the response
    const SHOW_SLUG_AND_CODE = true;

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
          where: { is_active: true },
          include: {
            user_permissions: {
              include: {
                role_permission: {
                  include: {
                    sub_module_permission: {
                      select: {
                        id: true,
                        action: true,
                        code: true, // uncommented — used below
                        sub_module: {
                          select: {
                            id: true,
                            name: true,
                            slug: true, // uncommented — used below
                            module: {
                              select: {
                                id: true,
                                name: true,
                                slug: true, // uncommented — used below
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                sub_module_permission: {
                  select: {
                    id: true,
                    action: true,
                    code: true, // uncommented — used below
                    sub_module: {
                      select: {
                        id: true,
                        name: true,
                        slug: true, // uncommented — used below
                        module: {
                          select: {
                            id: true,
                            name: true,
                            slug: true, // uncommented — used below
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            role: {
              select: {
                id: true,
                name: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.is_active !== true) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    const employee = user.employee;

    return {
      status: 'success',
      message: 'User is validated successfully',
      data: {
        id: user.id,
        employee_id: employee.id,
        full_name: [
          employee.person?.first_name,
          employee.person?.middle_name,
          employee.person?.last_name,
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
        company: employee.company?.name,
        division: employee.division?.name,
        position: employee.position?.name,
        security_clearance_level: user.security_clearance_level ?? 0,

        roles: user.user_roles.map((ur) => {
          const moduleMap = new Map<
            string,
            {
              id: string;
              name: string;
              slug?: string | null;
              subModules: Map<
                string,
                {
                  subModuleId: string;
                  name: string;
                  slug?: string | null;
                  // keyed by permission.id to prevent duplicate action entries
                  actionsMap: Map<string, ActionEntry>;
                }
              >;
            }
          >();

          ur.user_permissions.forEach((rp) => {
            // Prefer the direct permission if it exists; otherwise use the role's permission.
            const permission =
              rp.sub_module_permission ??
              rp.role_permission?.sub_module_permission;

            if (!permission) return;

            const subModule = permission?.sub_module;
            if (!subModule) return;

            const module = subModule.module;
            if (!module) return;

            if (!moduleMap.has(module.id)) {
              moduleMap.set(module.id, {
                id: module.id,
                name: module.name,
                ...(SHOW_SLUG_AND_CODE && { slug: module.slug ?? null }),
                subModules: new Map(),
              });
            }

            const moduleEntry = moduleMap.get(module.id)!;

            if (!moduleEntry.subModules.has(subModule.id)) {
              moduleEntry.subModules.set(subModule.id, {
                subModuleId: subModule.id,
                name: subModule.name,
                ...(SHOW_SLUG_AND_CODE && { slug: subModule.slug ?? null }),
                actionsMap: new Map(),
              });
            }

            const subModuleEntry = moduleEntry.subModules.get(subModule.id)!;

            // Build this action's entry
            const entry = {
              ...(rp.sub_module_permission_id && {
                subModulePermissionId: rp.sub_module_permission_id,
              }),
              ...(rp.role_permission_id && {
                rolePermissionId: rp.role_permission_id,
              }),
              action: permission.action,
              ...(SHOW_SLUG_AND_CODE && { code: permission.code ?? null }),
              source: rp.source ?? 'role',
            };

            // Merge with existing entry if this permission was already seen
            // (dedupes the case where both a role-based and direct/override
            // user_permission row point at the same sub_module_permission)
            const existing = subModuleEntry.actionsMap.get(permission.id);
            subModuleEntry.actionsMap.set(
              permission.id,
              existing ? { ...existing, ...entry } : entry,
            );
          });

          const modules = [...moduleMap.values()].map((module) => ({
            id: module.id,
            name: module.name,
            ...(SHOW_SLUG_AND_CODE && { slug: module.slug }),
            subModules: [...module.subModules.values()].map((sm) => ({
              subModuleId: sm.subModuleId,
              name: sm.name,
              ...(SHOW_SLUG_AND_CODE && { slug: sm.slug }),
              actions: [...sm.actionsMap.values()],
            })),
          }));

          return {
            id: ur.role_id ?? 0,
            roleName: ur.role.name,
            department: ur.role.department,
            isActive: ur.is_active,
            modules,
          };
        }),
      },
    };
  }
}
