import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import {
  AddRoleToUserDto,
  AddUserPermissionDto,
  AssignCustomRolePermissiontDto,
  AssignDirectPermissionDto,
} from './dto/role-management.dto';
import { PermissionSource, Prisma } from 'src/generated/prisma/client';

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
          user_roles: {
            select: {
              id: true,
              user_id: true,
              role_id: true,
              role_name: true,
              is_active: true,
              user_permissions: {
                select: {
                  id: true,
                  action: true,
                  sub_module_permission: {
                    select: {
                      id: true,
                      sub_module: {
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

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
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
        created_by: requestUser.id,
      },
    });

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role_id: dto.role_id,
      },
      include: {
        sub_module_permission: {
          select: {
            action: true,
          },
        },
      },
    });

    const userPermissions = rolePermissions.map((rp) => ({
      user_id: userId,
      user_role_id: userRole.id,
      role_permission_id: rp.id,
      source: PermissionSource.role,
      sub_module_permission_id: rp.sub_module_permission_id,
      action: rp.sub_module_permission.action,
      created_by: requestUser.id,
    }));

    await this.prisma.userPermission.createMany({
      data: userPermissions,
      skipDuplicates: true,
    });

    const userDetails = await this.prisma.user.findUnique({
      where: { id: userId, is_active: true },
      select: {
        person: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
    const userPosition = requestUser.employee.position?.name;

    return {
      status: 'success',
      message: `Role ${userRole.role_name} has been added to ${userDetails?.person.first_name}.`,
      created_by: `${userName} - ${userPosition}`,
      userRole,
      userPermissions,
    };
  }

  async unassignRoleUser(user: RequestUser, userId: string, roleId: string) {
    // Auth check
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
      throw new BadRequestException('User does not exist.');
    }

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];

    const canManageRoles = requestUser.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canManageRoles) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    // Find assigned role
    const userRole = await this.prisma.userRole.findUnique({
      where: {
        user_id_role_id: {
          user_id: userId,
          role_id: roleId,
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('Role is not assigned to this user.');
    }

    await this.prisma.$transaction(async (tx) => {
      // Delete permissions that came from this role
      await tx.userPermission.deleteMany({
        where: {
          user_id: userId,
          user_role_id: userRole.id,
          source: PermissionSource.role,
        },
      });

      // Remove the role assignment
      await tx.userRole.delete({
        where: {
          id: userRole.id,
        },
      });

      // Or if you prefer soft delete:
      // await tx.userRole.update({
      //   where: { id: userRole.id },
      //   data: { is_active: false },
      // });
    });

    const userDetails = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        person: {
          select: {
            first_name: true,
          },
        },
      },
    });

    const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
    const userPosition = requestUser.employee.position?.name;

    return {
      status: 'success',
      message: `Role has been removed from ${userDetails?.person.first_name}.`,
      removed_by: `${userName} - ${userPosition}`,
    };
  }

  // Sync missing or new role permissions to a role, to user with existing role
  async syncRolePermissions(user: RequestUser, userId: string, roleId: string) {
    const userRole = await this.prisma.userRole.findUnique({
      where: {
        user_id_role_id: {
          user_id: userId,
          role_id: roleId,
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('User does not have this role assigned.');
    }

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role_id: roleId,
        is_active: true,
      },
      include: {
        sub_module_permission: {
          select: {
            action: true,
          },
        },
        user_permission: {
          select: {
            source: true,
          },
        },
      },
    });

    // const permissionsToCreate = rolePermissions.map((rp) => ({
    //   user_id: userId,
    //   user_role_id: userRole.id,
    //   role_permission_id: rp.id,
    //   source: PermissionSource.role,
    //   sub_module_permission_id: rp.sub_module_permission_id,
    //   action: rp.sub_module_permission.action,
    //   created_by: user.id,
    // }));

    const userPermissions = await this.prisma.userPermission.findMany({
      where: {
        user_id: userId,
        user_role_id: userRole.id,
        source: PermissionSource.role,
      },
    });

    const rolePermissionIds = new Set(rolePermissions.map((rp) => rp.id));

    const existingUserPermissionIds = new Set(
      rolePermissions.map((rp) => rp.sub_module_permission_id).filter(Boolean),
    );

    const permissionsToCreate = rolePermissions
      .filter((rp) => !existingUserPermissionIds.has(rp.id))
      .map((rp) => ({
        user_id: userId,
        user_role_id: userRole.id,
        role_permission_id: rp.id,
        source: PermissionSource.role,
        sub_module_permission_id: rp.sub_module_permission_id,
        action: rp.sub_module_permission.action,
        created_by: user.id,
      }));

    const permissionsToDelete = userPermissions
      .filter(
        (up) =>
          up.role_permission_id &&
          !rolePermissionIds.has(up.role_permission_id),
      )
      .map((up) => up.id);

    // await this.prisma.userPermission.createMany({
    //   data: permissionsToCreate,
    //   skipDuplicates: true,
    // });

    await this.prisma.$transaction(async (tx) => {
      if (permissionsToDelete.length > 0) {
        await tx.userPermission.deleteMany({
          where: {
            id: {
              in: permissionsToDelete,
            },
          },
        });
      }

      if (permissionsToCreate.length > 0) {
        await tx.userPermission.createMany({
          data: permissionsToCreate,
          skipDuplicates: true,
        });
      }
    });

    return {
      message: 'Missing permissions synced successfully.',
    };
  }

  async roleUserPermisisons(
    user: RequestUser,
    userId: string,
    dto: AssignCustomRolePermissiontDto,
  ) {
    const { role_id, role_permission_id } = dto;

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

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const userRole = await this.prisma.userRole.findUnique({
      where: {
        user_id_role_id: {
          user_id: userId,
          role_id: role_id,
        },
      },
    });

    if (!userRole) {
      throw new BadRequestException('User does not have this role.');
    }

    const permissions = await this.prisma.rolePermission.findMany({
      where: {
        id: {
          in: role_permission_id,
        },
      },
      // to query for actions inside sub module permission table
      include: {
        sub_module_permission: {
          select: {
            id: true,
            action: true,
            sub_module: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!permissions) {
      throw new NotFoundException('Permission not found.');
    }

    const existingPermissions = await this.prisma.userPermission.findMany({
      where: {
        user_id: userId,
        user_role_id: userRole.id,
        // sub_module_permission_id: null, // only role based permission
        source: PermissionSource.role,
      },
    });

    if (!dto.role_permission_id?.length) {
      throw new BadRequestException('Provide role_permission_id.');
    }

    const permissionsToAdd = permissions.filter(
      (perm) =>
        !existingPermissions.some(
          (existing) => existing.role_permission_id === perm.id,
        ),
    );

    // const permissionsToDelete = existingPermissions.filter(
    //   (existing) => !role_permission_id.includes(existing.role_permission_id!),
    // );

    const userPermissionsToCreate = permissionsToAdd.map((perm) => ({
      user_id: userId,
      user_role_id: userRole.id,
      role_permission_id: perm.id,
      // sub_module_permission_id: null,
      sub_module_permission_id: perm.sub_module_permission_id,
      action: perm.sub_module_permission.action,
      source: PermissionSource.role,
      created_by: user.id,
    }));

    const result = await this.prisma.$transaction(async (tx) => {
      // if (permissionsToDelete.length) {
      //   await tx.userPermission.deleteMany({
      //     where: {
      //       user_id: userId,
      //       user_role_id: userRole.id,
      //       source: PermissionSource.role,
      //       role_permission_id: {
      //         notIn: role_permission_id,
      //       },
      //       // sub_module_permission_id: null,
      //     },
      //   });
      // }

      return tx.userPermission.createMany({
        data: userPermissionsToCreate,
        skipDuplicates: true,
      });
    });

    return {
      status: 'success',
      message: `Successfully added new role permisisons to user with role ${userRole.role_name}`,
      result,
    };
  }

  async directUserPermissions(
    user: RequestUser,
    userId: string,
    dto: AssignDirectPermissionDto,
  ) {
    const { role_id, sub_module_permission_id } = dto;

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

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const userRole = await this.prisma.userRole.findUnique({
      where: {
        user_id_role_id: {
          user_id: userId,
          role_id: role_id,
        },
      },
    });

    if (!userRole) {
      throw new BadRequestException('User does not have this role.');
    }

    const permissions = await this.prisma.subModulePermission.findMany({
      where: {
        id: {
          in: sub_module_permission_id,
        },
      },
    });

    const existingPermissions = await this.prisma.userPermission.findMany({
      where: {
        user_id: userId,
        user_role_id: userRole.id,
        // role_permission_id: null, // only direct permissions
        source: PermissionSource.direct,
      },
    });

    if (!dto.sub_module_permission_id?.length) {
      throw new BadRequestException('Provide sub_module_permission_id.');
    }

    // check available permissions to add
    const permissionsToAdd = permissions.filter(
      (perm) =>
        !existingPermissions.some(
          (existing) => existing.sub_module_permission_id === perm.id,
        ),
    );

    const permissionsToDelete = existingPermissions.filter(
      (existing) =>
        !sub_module_permission_id.includes(existing.sub_module_permission_id!),
    );

    const userPermissionsToCreate = permissionsToAdd.map((perm) => ({
      user_id: userId,
      user_role_id: userRole.id,
      role_permission_id: null,
      sub_module_permission_id: perm.id,
      action: perm.action,
      source: PermissionSource.direct,
      created_by: user.id,
    }));

    const result = await this.prisma.$transaction(async (tx) => {
      if (permissionsToDelete.length) {
        await tx.userPermission.deleteMany({
          where: {
            user_id: userId,
            user_role_id: userRole.id,
            role_permission_id: null,
            sub_module_permission_id: {
              notIn: sub_module_permission_id,
            },
          },
        });
      }

      return tx.userPermission.createMany({
        data: userPermissionsToCreate,
        skipDuplicates: true,
      });
    });

    return {
      status: 'success',
      message: `Successfully assigned direct permisisons to user with role ${userRole.role_name}`,
      result,
    };
  }

  //ADDING ROLE PERMISSION TO USER AFTER USER ACCOUNT CREATION
  async addPermissionToUserRole(
    userId: string,
    roleId: string,
    user: RequestUser,
    dto: AddUserPermissionDto,
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
            role_id: roleId,
          },
        },
      });

      if (!userRole) {
        throw new NotFoundException(
          'User does not have this role or user does not exist.',
        );
      }

      const rolePermissions = await tx.rolePermission.findMany({
        where: { id: { in: dto.rolePermissionIds } },
        include: {
          role: true,
          sub_module_permission: true,
        },
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
                created_at: new Date(),
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
              action: rp.sub_module_permission.action,
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

  // async updateUserSubmodule(
  //   userId: string,
  //   user: RequestUser,
  //   dto: UpdateUserSubmoudle,
  // ) {
  //   const { role_id, subModuleId } = dto;

  //   //Auth check first
  //   const requestUser = await this.prisma.user.findUnique({
  //     where: { id: user.id },
  //     include: {
  //       employee: {
  //         include: {
  //           person: true,
  //           position: true,
  //         },
  //       },
  //       user_roles: true,
  //     },
  //   });

  //   if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
  //     throw new BadRequestException(`User does not exist.`);
  //   }

  //   const allowedRoles = [
  //     'Administrator',
  //     'Super Administrator',
  //     'HR Manager',
  //     'HR Clerk',
  //     'HR Staff',
  //   ];
  //   const canView = requestUser?.user_roles.some((role) =>
  //     allowedRoles.includes(role.role_name),
  //   );

  //   if (!canView) {
  //     throw new ForbiddenException(
  //       'You are not authorized to perform this action',
  //     );
  //   }

  //   const userRole = await this.prisma.userRole.findUnique({
  //     where: {
  //       user_id_role_id: {
  //         user_id: userId,
  //         role_id: role_id,
  //       },
  //     },
  //   });

  //   if (!userRole) {
  //     throw new BadRequestException('User does not have this role.');
  //   }

  //   const subModules = await this.prisma.subModule.findMany({
  //     where: {
  //       id: { in: subModuleId },
  //     },
  //     include: {
  //       sub_module_permissions: {
  //         select: {
  //           id: true,
  //           action: true,
  //         },
  //       },
  //     },
  //   });

  //   const existingPermissions = await this.prisma.userPermission.findMany({
  //     where: {
  //       user_id: userId,
  //       user_role_id: userRole.id,
  //       // role_permission_id: null, // only direct permissions
  //     },
  //   });

  //   if (!dto.subModuleId?.length) {
  //     throw new BadRequestException('Provide submodule id.');
  //   }
  // }

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
                        sub_module: true,
                      },
                    },
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
        sub_module:
          perm.role_permission?.sub_module_permission.sub_module?.name ?? 'N/A',
        sub_module_id:
          perm.role_permission?.sub_module_permission.sub_module?.id ?? null,
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
