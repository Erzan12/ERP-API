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
import { CreatePermissionTemplateDto } from 'src/modules/manager/permission_template/dto/create-permission-template.dto';
import { CreateUserWithRolePermissionDto } from './dto/create-user-with-role-permission.dto';
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

@Injectable()
export class UserAccountService {
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
        stat: true,
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
    createUserWithRolePermissionDto: CreateUserWithRolePermissionDto,
    requestUser: RequestUser,
    req: Request,
    actorUser: any
  ) {
    return this.prisma.$transaction(async (tx) => {
      try {
        const plainPassword =
          createUserWithRolePermissionDto.user_details.password;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const existingUser = await this.prisma.user.findFirst({
          where: {
            OR: [
              { username: createUserWithRolePermissionDto.user_details.username },
              { email: createUserWithRolePermissionDto.user_details.email },
            ],
          },
        });

        if (existingUser) {
          throw new BadRequestException(
            'Username or email address already exist!',
          );
        }

        const creatorUser = await this.prisma.user.findUnique({
          where: { id: requestUser.id },
          include: {
            employee: {
              include: {
                person: true,
                position: true,
              },
            },
          },
        });

        if (
          !creatorUser ||
          !creatorUser.employee ||
          !creatorUser.employee.person
        ) {
          throw new BadRequestException(
            `Creator (manager) information not found.`,
          );
        }

        const admin = `${creatorUser.employee.person.first_name} ${creatorUser.employee.person.last_name}`;
        const adminPos = creatorUser.employee.position.name;

        const employee = await this.prisma.employee.findUnique({
          where: {
            employee_id: createUserWithRolePermissionDto.user_details.employee_id,
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
            username: createUserWithRolePermissionDto.user_details.username,
            email: createUserWithRolePermissionDto.user_details.email,
            password: hashedPassword,
            stat: 1,
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
        if (createUserWithRolePermissionDto.role_permission_ids?.length) {
          const rolePermissions = await this.prisma.rolePermission.findMany({
            where: {
              id: { in: createUserWithRolePermissionDto.role_permission_ids },
            },
          });

          // const userRolesMap = new Map<string, any>();
          // const userRolesMap = new Map<string, { id: number }>();

          const userRolesMap = new Map<string, any>();

          for (const rp of rolePermissions) {
            const key = `${rp.role_id}-${rp.sub_module_id}`;

            let userRole = userRolesMap.get(key);

            if (!userRole) {
              // Check if UserRole already exists
              userRole = await tx.userRole.findFirst({
                where: {
                  user_id: newUser.id,
                  role_id: rp.role_id,
                },
              });

              // If not exists, create it
              if (!userRole) {
                userRole = await tx.userRole.create({
                  data: {
                    user_id: newUser.id,
                    role_id: rp.role_id,
                    role_name: rp.role_name,
                    created_at: new Date(),
                  },
                });
              }

              userRolesMap.set(key, userRole);
            }

            // Ensure no duplicate permission
            const existingPermission = await tx.userPermission.findFirst({
              where: {
                user_id: newUser.id,
                user_role_id: userRole.id,
                role_permission_id: rp.id,
              },
            });

            if (!existingPermission) {
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

        await this.auditService.logUserCreation({
          actorUserId: actorUser?.id,
          actorEmail: actorUser?.email,
          newUser,
          req
        });

        return {
          status: 'success',
          message: `User ${newUser.username} with Employee ID ${newUser.employee?.employee_id} created with temporary password.`,
          created_by: {
            id: creatorUser.id,
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

  //ADDING ROLE PERMISSION TO USER AFTER USER ACCOUNT CREATION
  async addUserRolePermissions(
    userId: string,
    rolePermissionIds: string[],
    user: RequestUser,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: {
          user_roles: {
            include: { role: true }, // ⬅️ Optional: eager-load existing roles
          },
        },
      });
      if (!user) throw new BadRequestException('User not found');

      const rolePermissions = await tx.rolePermission.findMany({
        where: { id: { in: rolePermissionIds } },
      });

      const userRolesMap = new Map<string, any>();

      for (const rp of rolePermissions) {
        const key = `${rp.role_id}-${rp.sub_module_id}`;

        // let userRole = userRolesMap.get(key);
        // if (!userRole) {
        //     userRole = await tx.userRole.create({
        //     data: {
        //         user_id: user.id,
        //         role_id: rp.role_id,
        //         role_permission_id: rp.id,
        //         role_name: rp.role_name ?? null,
        //         // module_id: 1,
        //         // department_id: 1,
        //         created_at: new Date(),
        //     },
        //     });
        //     userRolesMap.set(key, userRole);
        // }
        let userRole = userRolesMap.get(key);

        // Check DB for existing UserRole (user_id + role_id)
        if (!userRole) {
          userRole = await tx.userRole.findFirst({
            where: {
              user_id: user.id,
              role_id: rp.role_id,
            },
            include: { role: true }, // ⬅️ load role to later return
          });

          if (!userRole) {
            userRole = await tx.userRole.create({
              data: {
                // user_id: user.id,
                // role_id: rp.role_id,
                user: {
                  connect: { id: user.id },
                },
                role: {
                  connect: { id: rp.role_id },
                },
                role_name: rp.role_name ?? null,
                // role_permission_id: rp.id,
                created_at: new Date(),
              },
              include: {
                role: true, // ensure we include the actual Role model
              },
            });

            await tx.user.update({
              where: { id: user.id },
              data: {
                user_roles: {
                  connect: { id: rp.role_id },
                },
              },
            });
          }

          userRolesMap.set(key, userRole);
        }

        // Ensure permission not already assigned
        const exists = await tx.userPermission.findFirst({
          where: {
            user_id: user.id,
            user_role_id: userRole.id,
            role_permission_id: rp.id,
          },
        });

        if (!exists) {
          await tx.userPermission.create({
            data: {
              user_id: user.id,
              user_role_id: userRole.id,
              role_permission_id: rp.id,
              action: rp.action,
            },
          });
        }
      }

      // 🧠 Optional: Extract all roles from the map and return them
      const roles = Array.from(userRolesMap.values()).map((ur) => ur.role);

      return {
        message: 'Roles and permissions added to user.',
        roles, // ⬅️ return roles if you want to update UI or check in frontend
      };
    });
  }

  //for querying user info
  async getUserPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        user_roles: {
          include: {
            role: true,
            // role_permission: {
            //     include: {
            //     sub_module: true,
            //     sub_module_permission: true,
            //     },
            // },
            user_permissions: {
              include: {
                role_permission: {
                  include: {
                    sub_module: true,
                    sub_module_permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const rolePermissions = user.user_roles.flatMap((userRole) =>
      userRole.user_permissions.map((perm) => ({
        role_id: userRole.role?.id,
        role_name: userRole.role?.name,
        action: perm.action,
        sub_module: perm.role_permission?.sub_module?.name ?? 'N/A',
        sub_module_id: perm.role_permission?.sub_module?.id ?? null,
      })),
    );

    return {
      user_id: user.id,
      username: user.username,
      email: user.email,
      roles: user.user_roles.map((r) => ({
        id: r.role?.id,
        name: r.role?.name,
      })),
      permissions: rolePermissions,
    };
  }

  async resendInvitation(
    id: string,
    user: RequestUser,
  ) {
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

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const admin = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const adminPos = requestUser.employee.position.name;

     // scalable approach
    const allowedRoles = ['Administrator', 'Super Administrator', 'Manager']
    const isAdmin = requestUser.user_roles.some(role => allowedRoles.includes(role.role_name))

     if (!isAdmin) {
      throw new ForbiddenException('User is not allowed create User Account');
    }

    const newUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!newUser) {
        throw new NotFoundException('User not found.');
      }

    if (!newUser.require_reset) {
      throw new BadRequestException(
        'User has already completed account setup.',
      );
    }

    // Call Auth service to regenerate token
    const resetToken = await this.authService.generateResetToken(newUser.id);
    // const { password_token } = token;

    await this.mailService.sendResetTokenEmail(
      newUser.email,
      newUser.username,
      // newUser.password,
      resetToken.token.password_token,
     );

    return {
      status: 'success',
      message: `Invitation resent to ${user.email}`,
      user_id: user.id,
      reset_token: resetToken.token,
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

    if (existingUser.stat === 0) {
      throw new ForbiddenException('User account is already deactivated');
    }

    // deactivation method
    await this.prisma.user.update({
      where: { id: deactivateUserAccountDto.user_id },
      data: {
        stat: 0,
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

    if (existingDeactivatedUser.stat === 1) {
      throw new ConflictException('User Account is still active');
    }

    await this.prisma.user.update({
      where: { id: reactivateUserAccountDto.user_id },
      data: {
        stat: 1,
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

    const findUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: true,
      },
    });

    if (!findUser) {
      throw new BadRequestException('User does not exist');
    }

    // Find the manager's department (if not admin)
    let departmentFilter = {};
    if (!isAdmin) {
      const currentEmployee = await this.prisma.employee.findUnique({
        where: { id: findUser.employee.id },
        select: { department_id: true },
      });

      if (!currentEmployee) {
        throw new ForbiddenException(
          'User is not linked to an employee profile.',
        );
      }

      // Only allow managers to view their own department
      if (isManager) {
        departmentFilter = { department_id: currentEmployee.department_id };
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
      message: findUser
        ? 'All new employees without user accounts'
        : 'New employees in your department without user accounts',
      data: {
        employees: newEmployees,
      },
    };
  }

  async addRoleUser(user: RequestUser, userId: string, roleName: string) {
    //find role
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
      include: {
        role_permissions: true,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
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

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const isAdmin = requestUser.user_roles.some(
      (role) =>
        // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
        role.role_name === 'Administrator' ||
        'Super Administrator' ||
        'Manager',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'User is not allowed to add role User Account.',
      );
    }

    //create UserRole (or use upsert)
    const userRole = await this.prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: userId,
          role_id: role.id,
        },
      },
      update: {},
      create: {
        user_id: userId,
        role_id: role.id,
        role_name: role.name,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    //prepare UserPermissions from RolePermissions
    const userPermissionsData = role.role_permissions.map((rp) => ({
      user_id: userId,
      user_role_id: userRole.id,
      role_permission_id: rp.id,
      action: rp.action,
    }));

    //insert UserPermissions (skip duplicates)
    await this.prisma.userPermission.createMany({
      data: userPermissionsData,
      skipDuplicates: true,
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `Role ${userRole.role_name} has been added to user ${userRole.user.username}`,
      added_by: {
        id: requestUser.id,
        name: userName,
        position: userPosition,
      },
      permissions: {
        userPermissionsData,
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
