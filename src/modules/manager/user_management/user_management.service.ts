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
import { Prisma, User } from '@prisma/client';
import { UserManagementPaginationDto } from 'src/utils/dtos/user-mngt-pagination.dto';
import { AttachmentUploadService } from 'src/jobs/attachment-upload/attachment-upload.service';
import { TRANSACTION_TYPE } from 'src/utils/constants/transaction-type.constants';
import { UserDetailsDto } from './dto/user-details.dto';
import { connect } from 'http2';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
    private readonly authService: AuthService,
    private readonly uploadService: AttachmentUploadService
  ) {}

  async getUser(user: RequestUser, userId: string) {
    // Auth check first
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    const getUser = await this.prisma.user.findUnique({
      where: { id: userId, is_active: true },
    })

    return {
      status: 'success',
      message: 'Here is the User',
      getUser,
    }
  }

  async getUsers(user: RequestUser, dto: UserManagementPaginationDto) {
    const { search, status, department, sortBy, order, page, perPage } = dto;

    // Auth check first
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    //pagination area
    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.UserWhereInput = {
      ...(status && {
        is_active: status === 'active',
      }),

      ...(department && {
        employee: {
          department: {
            is: {
              id: department
            },
          },
        },
      }),
    };

    let whereConditions: Prisma.UserWhereInput = {};

    if (search) {
      whereConditions = {
        OR: [
          {
            person: {
              first_name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          },
          {
            person: {
              middle_name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          },
          {
            person: {
              last_name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const allowSortFields = [
      "id",
      "created_at",
    ]

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';
    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
      }),
      this.prisma.user.findMany({
        where: { 
          ...whereCondition,
          ...whereConditions,
        },
        select: {
          id: true,
          username: true,
          email: true,
          is_active: true,
          avatar: true,
          employee: {
            select: {
              id: true,
              position: {
                select: {
                  id: true,
                  name: true,
                }
              },
              department: {
                select: {
                  id: true,
                  name: true,
                }
              },
              person: {
                select: {
                  first_name: true,
                  middle_name: true,
                  last_name: true,
                }
              }
            }
          },
          user_roles: {
            select: {
              id: true,
              role_name: true,
            },
          },
          createdBy: {
            select: {
              person: {
                select: {
                  first_name: true,
                  middle_name: true,
                  last_name: true,
                },
              },
            },
          },
          updatedBy: {
            select: {
              person: {
                select: {
                  first_name: true,
                  middle_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);


    return {
      status: 'success',
      message: 'List of User Accounts',
      count: total,
      page,
      perPage,
      // totalPage: Math.ceil(total / perPage),
      users
    };
  }

  //refactored version no more role_ids and module_ids in user account creation will be basing on the permission_tempalte model
  async createUserAccount(
    dto: UserDetailsDto,
    user: RequestUser,
    req: Request,
    // userId: string,
    file: Express.Multer.File
  ) {
    const plainPassword = dto.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { email: dto.email },
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
        employee_id: dto.employee_id,
      },
      include: { person: true },
    });

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          employee_id: employee.id,
          person_id: employee.person.id,
          username: dto.username,
          email: dto.email,
          password: hashedPassword,
          is_active: true,
          require_reset: 0,
          // created_by: ,
          created_at: new Date(),
        },
        include: {
          employee: true,
          user_roles: true,
        },
      });

      const empDept = await tx.employee.findUnique({
        where: { id: employee.id },
        include: { department: true },
      });

      if (!empDept) {
        throw new BadRequestException('Employee Department does not exist');
      }

      //use only role name instead of role permission ids when adding role to user
      if (dto.role_name) {
        // Find the role
        const role = await tx.role.findFirst({
          where: {
            name: dto.role_name,
            is_active: true,
          },
        });

        if (!role) {
          throw new BadRequestException('Invalid role name');
        }

        // Get all role permissions for that role
        const rolePermissions = await tx.rolePermission.findMany({
          where: {
            role_id: role.id,
            is_active: true,
          },
        });

        if (!rolePermissions.length) {
          throw new BadRequestException('No permissions found for this role');
        }

        // Create UserRole (only once)
        const userRole = await tx.userRole.create({
          data: {
            user_id: newUser.id,
            role_id: role.id,
            role_name: role.name,
            created_at: new Date(),
          },
        });

        // Create UserPermissions
        // await tx.userPermission.create({
        //   data: {
        //     user_id: newUser.id,
        //     user_role_id: userRole.id,
        //     role_permission_id: rp.id,
        //     action: rp.action,
        //   },
        // });
        await tx.userPermission.createMany({
          data: rolePermissions.map(rp => ({
            user_id: newUser.id,
            user_role_id: userRole.id,
            role_permission_id: rp.id,
            action: rp.action,
          })),
        });
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

      return {
        newUser,
        tokenKey,
        createdToken,
      };
    })

    // Destructure result — now accessible outside
    const { newUser, tokenKey, createdToken } = result;

    let attachment = null;

    if (file) {
      attachment = await this.uploadService.avatarUpload({
        file,
        transaction_type: TRANSACTION_TYPE.USER_AVATAR,
        transaction_id: newUser.id,
        user_id: user.id,
      });
    }

    // const attachment = await this.uploadService.avatarUpload({
    //   file,
    //   transaction_type: TRANSACTION_TYPE.USER_AVATAR,
    //   transaction_id: newUser.id,
    //   user_id: user.id,
    // }, tx);

    // Send welcome email
    await this.mailService.sendWelcomeMail(
      newUser.email,
      newUser.username,
      plainPassword,
      tokenKey,
    );

    const actorUser: User | null = await this.prisma.user.findUnique({
      where: { id: requestUser.id },
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
      attachment
      // user_permission_template: templates
    };
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

    if (existingUser.is_active === false) {
      throw new ForbiddenException('User account is already deactivated');
    }

    // deactivation method
    await this.prisma.user.update({
      where: { id: deactivateUserAccountDto.user_id },
      data: {
        is_active: false,
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

    if (existingDeactivatedUser.is_active === true) {
      throw new ConflictException('User Account is still active');
    }

    await this.prisma.user.update({
      where: { id: reactivateUserAccountDto.user_id },
      data: {
        is_active: true,
        // is_active: true,
      },
    });

    return {
      status: 'success',
      message: `User ID ${reactivateUserAccountDto.user_id} has been reactivated!`,
      reactivated_by: `User Role ID No. ${user.id}`,
    };
  }

  async viewNewEmployeeWithoutUserAccount(user: RequestUser, dto: UserManagementPaginationDto) {
    const { search, status, sortBy, order, page, perPage } = dto;

    // Auth check first
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

    const ROLES = {
      ADMINISTRATOR: 'Administrator',
      SUPER_ADMINISTRATOR: 'Super Administrator',
      MANAGER: 'Manager',
      HR_CLERK: 'HR Clerk',
      HR_STAFF: 'HR Staff',
    } as const;

    const allowedRoles = [ ROLES.ADMINISTRATOR, ROLES.SUPER_ADMINISTRATOR, ROLES.MANAGER, ROLES.HR_CLERK, ROLES.HR_STAFF];
    const canView = requestUser?.user_roles.some(role => 
      allowedRoles.includes(
        role.role_name as typeof allowedRoles[number],
      ),
    );

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    // const userRole = requestUser.user_roles.some(role => allowedRoles.includes(role.role_name));

    // if (!allowedRoles.includes(userRole)) {
    //   throw new ForbiddenException('Access denied');
    // }

    // pagination area
    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.EmployeeWhereInput = {
      user_id: null, user: null
    }

    const isAdmin = requestUser.user_roles.some(
      (role) => role.role_name === ROLES.ADMINISTRATOR,
    );

    const isManager = requestUser.user_roles.some(
      (role) => role.role_name === ROLES.MANAGER,
    );

    // const requestUser = await this.prisma.user.findUnique({
    //   where: { id: user.id },
    //   include: {
    //     employee: true,
    //   },
    // });

    // if (!requestUser) {
    //   throw new BadRequestException('User does not exist');
    // }

    // Find the manager's department (if not admin) -> if admin can view all employee from every dept without user account
    let departmentFilter = {};
    if (isAdmin) {
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

  async getManagers(user: RequestUser) {

    // Auth check first
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    const managers = await this.prisma.user.findMany({
      where: { 
        employee: {
          position: {
            // Get all managerial roles
            name: {
              in: ['hr manager', 'it manager'],
              mode: 'insensitive'
            },
          }
        } 
      },
      select: {
        id: true,
        username: true,
        is_active: true,
        last_login: true,
        avatar: true,
        email: true,
        employee: {
          select: {
            company: {
              select: {
                id: true,
                name: true,
              }
            },
            person: {
              select: {
                first_name: true,
                middle_name: true,
                last_name: true,
              }
            },
            employee_id: true,
            position: {
              select: {
                id: true,
                name: true,
              }
            },
            division: {
              select: {
                id: true,
                name: true,
              }
            },
            hire_date: true,
            salary: true,
            pay_frequency: true,
            employment_status: {
              select: {
                label: true,
              }
            },
            employment_type: true,
            employee_type: true,
            monthly_equivalent_salary: true,
            archive_date: true,
            other_employee_data: true,
            corporate_rank_id: true,
            department: {
              select: {
                id: true,
                name: true,
                division_id: true,
                is_active: true,
                employees: {
                  where: {
                    NOT: {
                      position: {
                        name: {
                          in: ['hr manager', 'it manager'],
                          mode: 'insensitive',
                        },
                      },
                    },
                  },
                  select: {
                    id: true,
                    person: {
                      select: {
                        first_name: true,
                        last_name: true,
                      }
                    },
                    department: {
                      select: {
                        name: true,
                      }
                    },
                    position: {
                      select: {
                        name: true,
                      }
                    },
                    employee_id: true
                  }
                }
              }
            },
          }
        }
      }
    })

    if (managers.length === 0) {
      throw new NotFoundException("No employee's or user with position manager as of now")
    }

    return {
      status: 'success',
      message: 'List of Managers with Department and Employees',
      managers
    }
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
