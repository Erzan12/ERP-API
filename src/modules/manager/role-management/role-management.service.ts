import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { AddRoleToUserDto } from './dto/role.dto';
import { AddUserPermissionDto } from './dto/add-user-role-permissions.dto';

@Injectable()
export class RoleManagementService {
  constructor(private readonly prisma: PrismaService) {}

  //Add Get Role -> to query the roles available
  async getRoles(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.RoleWhereInput = {
      is_active: true,
    };

    if (search) {
      const orConditions: Prisma.RoleWhereInput[] = [];

      orConditions.push({
        name: {
          contains: search,
          mode: 'insensitive',
        },
      });

      orConditions.push({
        description: {
          contains: search,
          mode: 'insensitive',
        },
      });

      //boolean search
      // if ( search === 'true' || search === 'false' ) {
      //   orConditions.push({
      //     stat or isActive: search === 'true',
      //   })
      // }

      whereCondition.OR = orConditions;
    }

    //prevent sorting by invalid fields(very important)
    const allowSortFields = ['id', 'name', 'created_at', 'updated_at', 'stat'];
    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, roles] = await this.prisma.$transaction([
      this.prisma.role.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.role.findMany({
        where: {
          ...whereCondition,
        },
        include: {
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

    // if (roles.length === 0) {
    //   throw new BadRequestException('No available or active roles exist!');
    // }

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

    const allowedRoles = ['Administrator', 'Super Administrator'];

    const canView = requestUser.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return {
      status: 'success',
      message: 'Here are the list of Roles',
      count: total,
      page,
      perPage,
      // totalPage: Math.ceil(total / perPage),
      roles,
    };
  }

  async getRole(roleId: string, user: RequestUser) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId, is_active: true },
      include: {
        role_permissions: true,
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
    });

    if (!role || role.is_active === false) {
      throw new NotFoundException('Role does not exist or is inactive');
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

    const allowedRoles = ['Administrator', 'Super Administrator'];

    const canView = requestUser.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Role',
      data: {
        role,
      },
    };
  }

  // async createRolePermissions(
  //   createRolePermissionDto: CreateRolePermissionDto,
  //   user: RequestUser,
  // ) {
  //   const { action, sub_module_id, role_id, department_id, position_id } =
  //     createRolePermissionDto;

  //   const existingRole = await this.prisma.role.findFirst({
  //     where: { id: role_id },
  //   });

  //   if (!existingRole) {
  //     throw new BadRequestException('Role not found or does not exist!');
  //   }

  //   const validSubModuleActions =
  //     await this.prisma.subModulePermission.findMany({
  //       where: { sub_module_id },
  //     });

  //   const validActions = validSubModuleActions.map((perm) => perm.action);

  //   const invalidActions = action.filter((act) => !validActions.includes(act));

  //   if (invalidActions.length > 0) {
  //     throw new BadRequestException(
  //       `Invalid action(s) for this sub module: ${invalidActions.join(', ')}`,
  //     );
  //   }

  //   // to map the role_name and sub_module_permission_id so it wont return null in prisma studio
  //   const subModulePermissionMap = new Map(
  //     validSubModuleActions.map((perm) => [perm.action, perm.id]),
  //   );

  //   const createRolePermission = action.map((act) => ({
  //     action: act,
  //     sub_module_id,
  //     role_id,
  //     role_name: existingRole.name,
  //     sub_module_permission_id: subModulePermissionMap.get(act)!, // ! to asset sub_mobule_permission id if it is always defined and cannot be null
  //     department_id,
  //     position_id,
  //   }));

  //   await this.prisma.rolePermission.createMany({
  //     data: createRolePermission,
  //     skipDuplicates: true,
  //   });

  //   const rolePermission = await this.prisma.role.findFirst({
  //     where: { id: role_id },
  //   });

  //   if (!rolePermission) {
  //     throw new BadRequestException('Role Permission does not exist');
  //   }

  //   const requestUser = await this.prisma.user.findUnique({
  //     where: { id: user.id },
  //     include: {
  //       employee: {
  //         include: {
  //           person: true,
  //           position: true,
  //           department: true,
  //         },
  //       },
  //       user_roles: true,
  //     },
  //   });

  //   if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
  //     throw new BadRequestException(`User does not exist.`);
  //   }

  //   const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
  //   const userPos = requestUser.employee.position.name;
  //   const userRole = requestUser.user_roles.map((r) => r.role_name);

  //   return {
  //     status: 'success',
  //     message: `Added permissions to Role ${rolePermission?.name}`,
  //     created_by: {
  //       id: requestUser.id,
  //       name: userName,
  //       department: requestUser.employee.department,
  //       position: userPos,
  //       role: userRole,
  //     },
  //     role_id: rolePermission.id,
  //     role_name: rolePermission.name,
  //   };
  // }



  // async updateRolePermissions(
  //   roleId: string,
  //   updateRolePermissionsDto: UpdateRolePermissionsDto,
  //   user: RequestUser,
  // ) {
  //   const { action_updates = [] } = updateRolePermissionsDto;

  //   const existingRole = await this.prisma.role.findUnique({
  //     where: { id: roleId },
  //     include: {
  //       role_permissions: {
  //         select: {
  //           sub_module_permission: true
  //         }
  //       },
  //     },
  //   });

  //   if (!existingRole) {
  //     throw new BadRequestException('Role does not exist!');
  //   }

  //   if (existingRole.role_permissions.length === 0) {
  //     throw new BadRequestException('This role has no existing role to update');
  //   }

  //   const toUpdate = existingRole.role_permissions.filter((perm) =>
  //     action_updates.some((update) => update.currentAction === perm.sub_module_permission.action),
  //   );

  //   const requestUser = await this.prisma.user.findUnique({
  //     where: { id: user.id },
  //     include: {
  //       employee: {
  //         include: {
  //           person: true,
  //           position: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
  //     throw new BadRequestException(`User does not exist.`);
  //   }

  //   const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
  //   const userPos = requestUser.employee.position.name;

  //   const results = await Promise.all(
  //     toUpdate.map((perm) => {
  //       const updateData = action_updates.find(
  //         (u) => u.currentAction === perm.sub_module_permission.action,
  //       );

  //       if (!updateData) {
  //         throw new ForbiddenException('Updating action failed');
  //       }

  //       return this.prisma.rolePermission.update({
  //         where: { id: roleId },
  //         data: {
  //           action: updateData.newAction,
  //         },
  //       });
  //     }),
  //   );
  //   return {
  //     status: 'success',
  //     message: 'Role Permission successfully updated',
  //     updated_by: {
  //       id: requestUser.id,
  //       name: userName,
  //       position: userPos,
  //     },
  //     updated_data: {
  //       results,
  //     },
  //   };
  // }

  async addRoleUser(user: RequestUser, userId: string, dto: AddRoleToUserDto) {
    //Auth check first
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
    
    //find role
    const role = await this.prisma.role.findUnique({
      where: { id: dto.role_id, is_active: true },
    });

    if (!role || role.is_active === false) {
      throw new NotFoundException('Role does not exist or is inactive');
    }

    // Only assign role
    const userRole = await this.prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: userId,
          role_id: dto.role_id,
        },
      },
      update: { is_active: true },
      create: {
        user_id: userId,
        role_id: dto.role_id,
        role_name: role.name,
        created_by: requestUser.id
      },
    });

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role_id: dto.role_id
      }
    });

    const userPermissions = rolePermissions.map(rp => ({
      user_id: userId,
      user_role_id: userRole.id,
      role_permission_id: rp.id,
      action: rp.action,
      created_by: requestUser.id
    }));

    await this.prisma.userPermission.createMany({
      data: userPermissions,
      skipDuplicates: true
    })

    const userDetails = await this.prisma.user.findUnique({
      where: { id: userId, is_active: true },
      select: {
        person: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      }
    })

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `Role ${userRole.role_name} has been added to ${userDetails?.person.first_name}.`,
      created_by: `${userName} - ${userPosition}`,
      userRole,
      userPermissions
    };
  }

  // Sync missing or new role permissions to a role, to user with existing role 
  async syncRolePermissions(
    user: RequestUser,
    userId: string,
    roleId: string,
  ) {
    const userRole = await this.prisma.userRole.findUnique({
      where: {
        user_id_role_id: {
          user_id: userId,
          role_id: roleId,
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException(
        'User does not have this role assigned.',
      );
    }

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role_id: roleId,
        is_active: true,
      },
    });

    const permissionsToCreate = rolePermissions.map((rp) => ({
      user_id: userId,
      user_role_id: userRole.id,
      role_permission_id: rp.id,
      action: rp.action,
      created_by: user.id,
    }));

    await this.prisma.userPermission.createMany({
      data: permissionsToCreate,
      skipDuplicates: true,
    });

    return {
      message: 'Missing permissions synced successfully.',
    };
  }

  //ADDING ROLE PERMISSION TO USER AFTER USER ACCOUNT CREATION
  async addPermissionToUserRole(
    userId: string,
    roleId: string,
    user: RequestUser,
    dto: AddUserPermissionDto
  ) {
    return this.prisma.$transaction(async (tx) => {
      // const existingUser = await tx.user.findUnique({
      //   where: { id: userId },
      //   include: {
      //     user_roles: {
      //       include: { role: true }, // ⬅️ Optional: eager-load existing roles
      //     },
      //   },
      // });

      // if (!existingUser) throw new BadRequestException('User not found');

      const userRole = await this.prisma.userRole.findUnique({
        where: {
          user_id_role_id: {
            user_id: userId,
            role_id: roleId
          },
        },
      });

      if (!userRole) {
        throw new NotFoundException('User does not have this role or user does not exist.');
      }

      

      const rolePermissions = await tx.rolePermission.findMany({
        where: { id: { in: dto.rolePermissionIds } },
        include: {
          role: true,
          sub_module_permission: true,
        }
      });

      type UserRoleWithRole = Prisma.UserRoleGetPayload<{
        include: { role: true };
      }>;

      const userRolesMap = new Map<string, UserRoleWithRole>();

      for (const rp of rolePermissions) {
        const key = `${rp.role_id}-${rp.sub_module_permission.sub_module_id}`;

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
          const existing = await tx.userRole.findFirst({
            where: {
              user_id: user.id,
              role_id: rp.role_id,
            },
            include: { role: true },
          });

          if (existing) {
            userRole = existing;
          } else {
            userRole = await tx.userRole.create({
              data: {
                user: {
                  connect: { id: user.id },
                },
                role: {
                  connect: { id: rp.role_id },
                },
                role_name: rp.role.name ?? null,
                created_at: new Date()
              },
              include: {
                role: true,
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
        throw new BadRequestException(`User does not exist.`);
      }

      const isAdmin = requestUser.user_roles.some(
        (role) =>
          role.role_name === 'Administrator' ||
          role.role_name === 'Super Administrator',
      );

      if (!isAdmin) {
        throw new ForbiddenException(
          'You are not allowed to perform this action',
        );
      }

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
                    sub_module_permission: {
                      include: {
                        sub_module: true
                      }
                    }
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
        sub_module: perm.role_permission?.sub_module_permission.sub_module?.name ?? 'N/A',
        sub_module_id: perm.role_permission?.sub_module_permission.sub_module?.id ?? null,
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
}
