import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/jobs/mail/mail.service';
import { CreateUserWithRoleDto } from './dto/create-user-with-role-permission.dto';
import {
  DeactivateUserAccountDto,
  ReactivateUserAccountDto,
} from './dto/user-account-status.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { UserEmailResetTokenDto } from './dto/user-email.reset-token.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Request } from 'express';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from '@prisma/client';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
    private readonly authService: AuthService,
  ) {}

  async viewUserAccount(user: RequestUser) {
    const canViewAllUsers = user.roles.some(
      (role) => role.name === 'Administrator',
      'Manager',
    );

    const users = await this.prisma.user.findMany({
      where: canViewAllUsers ? {} : { id: user.id },
      select: {
        id: true,
        username: true,
        user_roles: {
          select: {
            role_name: true,
          },
        },
        isActive: true,
      },
    });
    return {
      status: 'success',
      message: canViewAllUsers ? 'All User Accounts' : 'User Account',
      data: {
        user_accounts: users,
      },
    };
  }

  //refactored version no more role_ids and module_ids in user account creation will be basing on the permission_tempalte model
  async createUserAccount(
    createUserWithRoleDto: CreateUserWithRoleDto,
    user: RequestUser,
    req: Request,
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      try {
        const plainPassword = createUserWithRoleDto.user_details.password;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const existingUser = await this.prisma.user.findFirst({
          where: {
            OR: [
              { username: createUserWithRoleDto.user_details.username },
              { email: createUserWithRoleDto.user_details.email },
            ],
          },
        });

        if (existingUser) {
          throw new BadRequestException(
            'Username or email address already exist!',
          );
        }

        const requestUser = await this.prisma.user.findUnique({
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

        if (
          !requestUser ||
          !requestUser.employee ||
          !requestUser.employee.person
        ) {
          throw new BadRequestException(
            `Creator (manager) information not found.`,
          );
        }

        const admin = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const adminPos = requestUser.employee.position.name;

        // scalable approach
        const allowedRoles = [
          'Administrator',
          'Super Administrator',
          'Manager',
        ];
        const isAdmin = requestUser.user_roles.some((role) =>
          allowedRoles.includes(role.role_name),
        );

        if (!isAdmin) {
          throw new ForbiddenException(
            'User is not allowed create User Account',
          );
        }

        const employee = await this.prisma.employee.findUnique({
          where: {
            employee_id: createUserWithRoleDto.user_details.employee_id,
          },
          include: { person: true },
        });

        if (!employee) {
          throw new BadRequestException('Employee not found');
        }

        const userExist = await this.prisma.user.findUnique({
          where: { employee_id: employee.id },
        });

        if (userExist) {
          throw new BadRequestException('User already exist');
        }

        const newUser = await tx.user.create({
          data: {
            employee_id: employee.id,
            person_id: employee.person.id,
            username: createUserWithRoleDto.user_details.username,
            email: createUserWithRoleDto.user_details.email,
            password: hashedPassword,
            isActive: true,
            require_reset: 1,
            created_by: admin,
            created_at: new Date(),
          },
          include: {
            employee: true,
            user_roles: true,
          },
        });

        const empDept = await this.prisma.employee.findUnique({
          where: { id: employee.id },
          include: { department: true },
        });

        if (!empDept) {
          throw new BadRequestException('Employee Department does not exist');
        }

        //optional role permission creation upon creating user account
        // if (createUserWithRoleDto.role_name?.length) {
        //   const rolePermissions = await this.prisma.rolePermission.findFirst({
        //     where: {
        //       id: createUserWithRoleDto.role_name,
        //     },
        //   });

        //   // const userRolesMap = new Map<string, any>();
        //   // const userRolesMap = new Map<string, { id: number }>();

        //   const userRolesMap = new Map<string, any>();

        //   for (const rp of rolePermissions) {
        //     const key = `${rp.role_id}-${rp.sub_module_id}`;

        //     let userRole = userRolesMap.get(key);

        //     if (!userRole) {
        //       // Check if UserRole already exists
        //       userRole = await tx.userRole.findFirst({
        //         where: {
        //           user_id: newUser.id,
        //           role_id: rp.role_id,
        //         },
        //       });

        //       // If not exists, create it
        //       if (!userRole) {
        //         userRole = await tx.userRole.create({
        //           data: {
        //             user_id: newUser.id,
        //             role_id: rp.role_id,
        //             role_name: rp.role_name,
        //             created_at: new Date(),
        //           },
        //         });
        //       }

        //       userRolesMap.set(key, userRole);
        //     }

        //     // Ensure no duplicate permission
        //     const existingPermission = await tx.userPermission.findFirst({
        //       where: {
        //         user_id: newUser.id,
        //         user_role_id: userRole.id,
        //         role_permission_id: rp.id,
        //       },
        //     });

        //     if (!existingPermission) {
        //       await tx.userPermission.create({
        //         data: {
        //           user_id: newUser.id,
        //           user_role_id: userRole.id,
        //           role_permission_id: rp.id,
        //           action: rp.action,
        //         },
        //       });
        //     }
        //   }
        // }

        //use only role name instead of role permission ids when adding role to user
        if (createUserWithRoleDto.role_name) {
          // 1️⃣ Find the role
          const role = await tx.role.findFirst({
            where: {
              name: createUserWithRoleDto.role_name,
              isActive: true,
            },
          });

          if (!role) {
            throw new BadRequestException('Invalid role name');
          }

          // 2️⃣ Get all role permissions for that role
          const rolePermissions = await tx.rolePermission.findMany({
            where: {
              role_id: role.id,
              isActive: true,
            },
          });

          if (!rolePermissions.length) {
            throw new BadRequestException('No permissions found for this role');
          }

          // 3️⃣ Create UserRole (only once)
          const userRole = await tx.userRole.create({
            data: {
              user_id: newUser.id,
              role_id: role.id,
              role_name: role.name,
              created_at: new Date(),
            },
          });

          // 4️⃣ Create UserPermissions
          for (const rp of rolePermissions) {
            await tx.userPermission.create({
              data: {
                user_id: newUser.id,
                user_role_id: userRole.id,
                role_permission_id: rp.id,
                action: rp.action,
              },
            });
          }
        }

        // Create password reset token
        const tokenKey = crypto.randomBytes(64).toString('hex');
        const createdToken = await tx.passwordResetToken.create({
          data: {
            user_id: newUser.id,
            password_token: tokenKey,
            expires_at: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000),
          },
        });

        // Generate user session token
        const userToken = crypto.randomBytes(64).toString('hex');
        await tx.userToken.create({
          data: {
            user_id: newUser.id,
            user_token: userToken,
          },
        });

        // Send welcome email
        await this.mailService.sendWelcomeMail(
          newUser.email,
          newUser.username,
          plainPassword,
          tokenKey,
        );

        const actorUser: User | null = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        await this.auditService.logUserCreation({
          actorUserId: actorUser?.id,
          actorEmail: actorUser?.email,
          newUser,
          req,
        });

        return {
          status: 'success',
          message: `User ${newUser.username} with Employee ID ${newUser.employee?.employee_id} created with temporary password.`,
          created_by: {
            id: requestUser.id,
            name: admin,
            position: adminPos,
          },
          user_id: newUser.id,
          username: newUser.username,
          password: plainPassword,
          reset_token: createdToken.password_token,
          // user_permission_template: templates
        };
      } catch (error) {
        console.error('Create user failed:', error);
        throw error;
      }
    });
  }

  async resendInvitation(dto: UserEmailResetTokenDto, user: RequestUser) {
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
    const adminPos = actingUser.employee.position.name;

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
      throw new NotFoundException('User not found.');
    }

    if (invitedUser.require_reset === 0) {
      throw new BadRequestException(
        'User has already completed account setup.',
      );
    }

    // Call Auth service to regenerate token
    const resetToken = await this.authService.generateResetToken(
      invitedUser.id,
    );
    // const { password_token } = token;

    await this.mailService.sendResetTokenEmail(
      invitedUser.email,
      invitedUser.username,
      // newUser.password,
      resetToken.token.password_token,
    );

    return {
      status: 'success',
      message: `Invitation resent to ${user.email}`,
      user_id: invitedUser.id,
      reset_token: resetToken.token,
      user_name: invitedUser.username,
      updated_by: {
        name: admin,
        position: adminPos,
      },
    };
  }

  async deactivateUserAccount(
    deactivateUserAccountDto: DeactivateUserAccountDto,
    user: RequestUser,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: deactivateUserAccountDto.user_id },
    });

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    if (existingUser.isActive === false) {
      throw new ForbiddenException('User account is already deactivated');
    }

    // deactivation method
    await this.prisma.user.update({
      where: { id: deactivateUserAccountDto.user_id },
      data: {
        isActive: false,
        // is_active: false,
      },
    });

    return {
      status: 'success',
      message: `User ID ${deactivateUserAccountDto.user_id} has been deactivated`,
      deactivated_by: `User Role ID No. ${user.id}`,
    };
  }

  async reactivateUserAccount(
    reactivateUserAccountDto: ReactivateUserAccountDto,
    user: RequestUser,
  ) {
    const existingDeactivatedUser = await this.prisma.user.findUnique({
      where: { id: reactivateUserAccountDto.user_id },
    });

    if (!existingDeactivatedUser) {
      throw new BadRequestException('Deactivated User not found');
    }

    if (existingDeactivatedUser.isActive === true) {
      throw new ConflictException('User Account is still active');
    }

    await this.prisma.user.update({
      where: { id: reactivateUserAccountDto.user_id },
      data: {
        isActive: true,
        // is_active: true,
      },
    });

    return {
      status: 'success',
      message: `User ID ${reactivateUserAccountDto.user_id} has been reactivated!`,
      reactivated_by: `User Role ID No. ${user.id}`,
    };
  }

  async viewNewEmployeeWithoutUserAccount(user: RequestUser) {
    const isAdmin = user.roles.some((role) => role.name === 'Administrator');
    const isManager = user.roles.some((role) => role.name === 'Manager');

    const requestUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: true,
      },
    });

    if (!requestUser) {
      throw new BadRequestException('User does not exist');
    }

    // Find the manager's department (if not admin) -> if admin can view all employee from every dept without user account
    let departmentFilter = {};
    if (!isAdmin) {
      await this.prisma.employee.findUnique({
        where: { id: requestUser.employee.id },
        select: { department_id: true },
      });

      if (!requestUser) {
        throw new ForbiddenException(
          'User is not linked to an employee profile.',
        );
      }

      // Only allow managers to view their own department
      if (isManager) {
        departmentFilter = {
          department_id: requestUser.employee.department_id,
        };
      } else {
        throw new ForbiddenException(
          'Only administrators or department managers can view new employees.',
        );
      }
    }

    // Fetch employees with no user account in allowed department
    const newEmployees = await this.prisma.employee.findMany({
      where: {
        user: null,
        ...departmentFilter,
      },
      select: {
        id: true,
        employee_id: true,
        person: true,
        department: {
          select: { id: true, name: true },
        },
        user: true,
      },
    });

    if (newEmployees.length === 0) {
      throw new ForbiddenException(
        'No new employees without user accounts found.',
      );
    }

    return {
      status: 'success',
      message: requestUser
        ? 'All new employees without user accounts'
        : 'New employees in your department without user accounts',
      data: {
        employees: newEmployees,
      },
    };
  }

  // async getUsersWithRolesAndPermissions() {
  //     const users = await this.prisma.user.findMany({
  //         include: {
  //         user_roles: {
  //             include: {
  //             role: true,
  //             module: true,
  //             user_permissions: {
  //                 include: {
  //                 role_permission: {
  //                     include: {
  //                     sub_module_permission: true,
  //                     },
  //                 },
  //                 },
  //             },
  //             },
  //         },
  //         },
  //     });

  //     const formattedUsers = users.map(user => ({
  //         id: user.id,
  //         username: user.username,
  //         email: user.email,
  //         roles: user.user_roles.map(userRole => ({
  //         roleId: userRole.role?.id,
  //         roleName: userRole.role?.name,
  //         module: {
  //             id: userRole.module.id,
  //             name: userRole.module.name,
  //         },
  //         permissions: userRole.user_permissions.map(up => ({
  //             action: up.user_role_permission,
  //             permissionName: up.role_permission?.sub_module_permission_id?
  //             // status: up.role_permission?.status,
  //         })),
  //         })),
  //     }));

  //     return formattedUsers;
  // }
}
