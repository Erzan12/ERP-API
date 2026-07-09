import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateRoleDto,
  UpdateRoleDto,
  UpdateRolePermissionDto,
} from './dto/role.dto';
import { RoleWithPermissions } from 'src/utils/types/role-with-permission.interface';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';
import { GroupedPermission } from './type/group-permission';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  //formatted role helper
  private formatRolePermissions(role: RoleWithPermissions) {
    const { role_permissions, ...rest } = role;

    const groupedPermissions = role_permissions.reduce<
      Record<string, GroupedPermission>
    >((acc, permission) => {
      const subModule = permission.sub_module_permission.sub_module;
      const subModuleId = subModule.id;

      if (!acc[subModuleId]) {
        acc[subModuleId] = {
          id: subModule.id,
          actions: [],
          sub_module: {
            id: subModule.id,
            name: subModule.name,
          },
        };
      }

      // acc[subModuleId].actions.push(permission.sub_module_permission.actions);
      acc[subModuleId].actions.push({
        role_permission_id: permission.id,
        sub_module_permission_id: permission.sub_module_permission.id,
        action: permission.sub_module_permission.action,
      });

      return acc;
    }, {});

    return {
      ...rest,
      department: role_permissions[0]?.role.department ?? null,
      role_permissions: Object.values(groupedPermissions),
    };
  }

  //Add Get Role -> to query the roles available
  async getRoles(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

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
    const allowSortFields = [
      'id',
      'name',
      'created_at',
      'updated_at',
      'isActive',
    ];
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
          role_permissions: {
            select: {
              id: true,
              role: {
                select: {
                  id: true,
                  name: true,
                  department_id: true,
                  department: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              sub_module_permission: {
                select: {
                  id: true,
                  sub_module_action_id: true,
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

    const formattedRoles = roles.map((role) =>
      this.formatRolePermissions(role),
    );

    // if (roles.length === 0) {
    //   throw new BadRequestException('No available or active roles exist!');
    // }

    return {
      status: 'success',
      message: 'Here are the list of Roles',
      count: total,
      page,
      perPage,
      // totalPage: Math.ceil(total / perPage),
      roles: formattedRoles,
    };
  }

  async getRolePermissions(user: RequestUser) {
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

    const rolePermissions = await this.prisma.rolePermission.findMany({
      // where: { id: roleId },
      select: {
        // id: true,
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
        user_permission: {
          select: {
            id: true,
            action: true,
            user_id: true,
            user_role_id: true,
            role_permission_id: true,
          },
        },
      },
    });

    if (rolePermissions.length === 0) {
      throw new NotFoundException('There are no role permissions available');
    }

    return {
      status: 'success',
      message: 'List of Role Permissions available',
      rolePermissions,
    };
  }

  async getRole(roleId: string, user: RequestUser) {
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

    const role = await this.prisma.role.findUnique({
      where: { id: roleId, is_active: true },
      include: {
        role_permissions: {
          select: {
            id: true,
            role: {
              select: {
                id: true,
                name: true,
                department_id: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            sub_module_permission: {
              select: {
                id: true,
                sub_module_action_id: true,
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
    });

    if (!role || role.is_active === false) {
      throw new NotFoundException('Role does not exist or is inactive');
    }

    // const groupPermissions = role.role_permissions.reduce(
    //   (acc, permission) => {
    //     const subModule =
    //       permission.sub_module_permission.sub_module;

    //     const subModuleId = subModule.id;

    //     if (!acc[subModuleId]) {
    //       acc[subModuleId] = {
    //         id: permission.sub_module_permission.id,
    //         actions: [],
    //         subModule: {
    //           id: subModule.id,
    //           name: subModule.name,
    //         },
    //       };
    //     }

    //     acc[subModuleId].actions.push(
    //       permission.sub_module_permission.action,
    //     );

    //     return acc;
    //   },
    //   {} as Record<string, any>,
    // );

    // const formattedRole = {
    //   ...role,
    //   role_permissions: Object.values(groupPermissions),
    // };

    const formattedRole = this.formatRolePermissions(role);

    return {
      status: 'success',
      message: 'Here is the Role',
      role: formattedRole,
    };
  }

  async createRole(createRoleDto: CreateRoleDto, user: RequestUser) {
    const { name, description, department_id } = createRoleDto;

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

    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new BadRequestException('Role already exist! Try again');
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    const role = await this.prisma.role.create({
      data: {
        name,
        description,
        department_id,
        created_by: user.id,
      },
    });

    return {
      status: 'success',
      message: `Role have been successfully created!`,
      // created_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      role,
      created_by_user: `${userName} - ${userPosition}`,
    };
  }

  async updateRole(dto: UpdateRoleDto, user: RequestUser, roleId: string) {
    const { name, description, department_id, is_active } = dto;

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

    const existingRole = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      throw new BadRequestException('Role does not exist!');
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    const role = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        department_id: department_id ?? undefined,
        is_active: is_active ?? undefined,
        updated_by: user.id,
      },
    });

    return {
      status: 'success',
      message: `Role have been successfully updated!`,
      // created_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      role,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }

  //Add Get submodule permission -> to query the submodule permission table for available submolues with permission
  async assignRolePermissions(dto: UpdateRolePermissionDto, user: RequestUser) {
    const { sub_module_id, role_id, sub_module_permission_id } = dto;

    // Auth check first
    const requestUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: {
          include: {
            department: true,
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

    const existingRole = await this.prisma.role.findUnique({
      where: { id: role_id, is_active: true },
      include: {
        user_roles: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingRole) {
      throw new BadRequestException('Role not found or does not exist!');
    }

    const existingRolePermission = await this.prisma.rolePermission.findMany({
      where: {
        role_id,
        sub_module_permission: {
          sub_module_id,
        },
      },
      include: {
        sub_module_permission: {
          select: {
            id: true,
            action: true,
            sub_module_id: true,
          },
        },
      },
    });

    const existingActions = existingRolePermission.map(
      (rp) => rp.sub_module_permission.id,
    );

    // permissions to remove in the role
    const actionsToDelete = existingRolePermission
      .filter(
        (rp) => !sub_module_permission_id.includes(rp.sub_module_permission.id),
      )
      .map((rp) => rp.id);

    // check permissions added in submodule permission before it will be assigned to role permission
    const availablePermissions = await this.prisma.subModulePermission.findMany(
      {
        where: {
          sub_module_id,
        },
        select: {
          id: true,
          action: true,
        },
      },
    );

    // const validActions = availablePermissions.map((perm) => perm.action);

    // const invalidActions = actions.filter((act) => !validActions.includes(act));

    // using a Set
    const validActions = new Set(availablePermissions.map((p) => p.action));
    const invalidActions = sub_module_permission_id.filter(
      (act) => !validActions.has(act),
    );

    if (invalidActions.length > 0) {
      throw new BadRequestException(
        `Invalid aciton(s) for this sub module: ${invalidActions.join(', ')}`,
      );
    }

    // Filter from the requested actions:
    // Now only the actions that were sent by the client are created.
    const actionsToCreate = availablePermissions.filter(
      (perm) =>
        sub_module_permission_id.includes(perm.id) &&
        !existingActions.includes(perm.id),
    );

    const createRolePermission = actionsToCreate.map((perm) => ({
      // action: perm.action,
      role_id,
      sub_module_permission_id: perm.id, // to assess sub_module_permission_id if it is always defined and cannot be null
      created_by: user.id,
    }));

    const result = await this.prisma.$transaction(async (tx) => {
      if (actionsToDelete.length > 0) {
        await tx.rolePermission.deleteMany({
          where: {
            id: {
              in: actionsToDelete,
            },
          },
        });
      }

      return tx.rolePermission.createMany({
        data: createRolePermission,
        skipDuplicates: true,
      });
    });

    const updateRole = await this.prisma.role.findUnique({
      where: {
        id: role_id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        is_active: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        // role_permissions: {
        //   select: {
        //     id: true,
        //     is_active: true,
        //     sub_module_permission: {
        //       select: {
        //         action: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    const requestedCount = sub_module_permission_id.length;
    const createdCount = result.count;
    const deletedCount = actionsToDelete.length;

    let message = '';

    // if (createdCount === 0) {
    //   message = `All selected permissions already exist in Role ${existingRole.name}.`;
    // } else if (createdCount < requestedCount) {
    //   message = `${createdCount} permission(s) added. ${
    //     requestedCount - createdCount
    //   } permission(s) already existed in Role ${existingRole.name}`;
    // } else {
    //   message = `Added ${createdCount} permission(s) to Role ${existingRole.name}`;
    // }

    if (createdCount === 0 && deletedCount === 0) {
      message = 'No changes were made.';
    } else {
      message = `Added ${createdCount} permission(s), removed ${deletedCount} permission(s).`;
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message,
      // : `Added permissions to Role ${existingRole.name}`,
      created_by: `${userName} - ${userPosition}`,
      role: updateRole,
      data: {
        requested: requestedCount,
        created: createdCount,
        deleted: deletedCount,
        current_permissions: sub_module_permission_id,
      },
    };
  }
}

@Injectable()
export class RolePermissionService {
  constructor(private readonly prisma: PrismaService) {}

  //formatted role helper
  private formatRolePermissions(role: RoleWithPermissions) {
    const { role_permissions, ...rest } = role;

    const groupedPermissions = role_permissions.reduce<
      Record<string, GroupedPermission>
    >((acc, permission) => {
      const subModule = permission.sub_module_permission.sub_module;
      const subModuleId = subModule.id;

      if (!acc[subModuleId]) {
        acc[subModuleId] = {
          id: subModule.id,
          actions: [],
          sub_module: {
            id: subModule.id,
            name: subModule.name,
          },
        };
      }

      // acc[subModuleId].actions.push(permission.sub_module_permission.actions);
      acc[subModuleId].actions.push({
        role_permission_id: permission.id,
        sub_module_permission_id: permission.sub_module_permission.id,
        action: permission.sub_module_permission.action,
      });

      return acc;
    }, {});

    return {
      ...rest,
      department: role_permissions[0]?.role.department ?? null,
      role_permissions: Object.values(groupedPermissions),
    };
  }

  // //Add Get submodule permission -> to query the submodule permission table for available submolues with permission
  // async assignRolePermissions(dto: UpdateRolePermissionDto, user: RequestUser) {
  //   const { sub_module_id, role_id, actions } = dto;

  //   // Auth check first
  //   const requestUser = await this.prisma.user.findUnique({
  //     where: { id: user.id },
  //     include: {
  //       employee: {
  //         include: {
  //           department: true,
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

  //   const existingRole = await this.prisma.role.findUnique({
  //     where: { id: role_id, is_active: true },
  //     include: {
  //       user_roles: {
  //         select: {
  //           id: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!existingRole) {
  //     throw new BadRequestException('Role not found or does not exist!');
  //   }

  //   const existingRolePermission = await this.prisma.rolePermission.findMany({
  //     where: {
  //       role_id,
  //       sub_module_permission: {
  //         sub_module_id,
  //       },
  //     },
  //     include: {
  //       sub_module_permission: {
  //         select: {
  //           id: true,
  //           action: true,
  //           sub_module_id: true,
  //         },
  //       },
  //     },
  //   });

  //   const existingActions = existingRolePermission.map(
  //     (rp) => rp.sub_module_permission.action,
  //   );

  //   // permissions to remove in the role
  //   const actionsToDelete = existingRolePermission
  //     .filter((rp) => !actions.includes(rp.sub_module_permission.action))
  //     .map((rp) => rp.id);

  //   // check permissions added in submodule permission before it will be assigned to role permission
  //   const availablePermissions = await this.prisma.subModulePermission.findMany(
  //     {
  //       where: {
  //         sub_module_id,
  //       },
  //       select: {
  //         id: true,
  //         action: true,
  //       },
  //     },
  //   );

  //   // const validActions = availablePermissions.map((perm) => perm.action);

  //   // const invalidActions = actions.filter((act) => !validActions.includes(act));

  //   // using a Set
  //   const validActions = new Set(availablePermissions.map((p) => p.action));
  //   const invalidActions = actions.filter((act) => !validActions.has(act));

  //   if (invalidActions.length > 0) {
  //     throw new BadRequestException(
  //       `Invalid aciton(s) for this sub module: ${invalidActions.join(', ')}`,
  //     );
  //   }

  //   // Filter from the requested actions:
  //   // Now only the actions that were sent by the client are created.
  //   const actionsToCreate = availablePermissions.filter(
  //     (perm) =>
  //       actions.includes(perm.action) && !existingActions.includes(perm.action),
  //   );

  //   const createRolePermission = actionsToCreate.map((perm) => ({
  //     // action: perm.action,
  //     role_id,
  //     sub_module_permission_id: perm.id, // to assess sub_module_permission_id if it is always defined and cannot be null
  //     created_by: user.id,
  //   }));

  //   const result = await this.prisma.$transaction(async (tx) => {
  //     if (actionsToDelete.length > 0) {
  //       await tx.rolePermission.deleteMany({
  //         where: {
  //           id: {
  //             in: actionsToDelete,
  //           },
  //         },
  //       });
  //     }

  //     return tx.rolePermission.createMany({
  //       data: createRolePermission,
  //       skipDuplicates: true,
  //     });
  //   });

  //   const updateRole = await this.prisma.role.findUnique({
  //     where: {
  //       id: role_id,
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       description: true,
  //       is_active: true,
  //       department: {
  //         select: {
  //           id: true,
  //           name: true,
  //         },
  //       },
  //       // role_permissions: {
  //       //   select: {
  //       //     id: true,
  //       //     is_active: true,
  //       //     sub_module_permission: {
  //       //       select: {
  //       //         action: true,
  //       //       },
  //       //     },
  //       //   },
  //       // },
  //     },
  //   });

  //   const requestedCount = actions.length;
  //   const createdCount = result.count;
  //   const deletedCount = actionsToDelete.length;

  //   let message = '';

  //   // if (createdCount === 0) {
  //   //   message = `All selected permissions already exist in Role ${existingRole.name}.`;
  //   // } else if (createdCount < requestedCount) {
  //   //   message = `${createdCount} permission(s) added. ${
  //   //     requestedCount - createdCount
  //   //   } permission(s) already existed in Role ${existingRole.name}`;
  //   // } else {
  //   //   message = `Added ${createdCount} permission(s) to Role ${existingRole.name}`;
  //   // }

  //   if (createdCount === 0 && deletedCount === 0) {
  //     message = 'No changes were made.';
  //   } else {
  //     message = `Added ${createdCount} permission(s), removed ${deletedCount} permission(s).`;
  //   }

  //   const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
  //   const userPosition = requestUser.employee.position.name;

  //   return {
  //     status: 'success',
  //     message,
  //     // : `Added permissions to Role ${existingRole.name}`,
  //     created_by: `${userName} - ${userPosition}`,
  //     role: updateRole,
  //     data: {
  //       requested: requestedCount,
  //       created: createdCount,
  //       deleted: deletedCount,
  //       current_permissions: actions,
  //     },
  //   };
  // }

  async getSingleRoleWithPermissions(user: RequestUser, roleId: string) {
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

    const roleWithPermissions = await this.prisma.role.findUnique({
      where: { id: roleId, is_active: true },
      include: {
        role_permissions: {
          select: {
            id: true,
            // sub_module_permission_id: true,
            // is_active: true,
            role: {
              select: {
                id: true,
                name: true,
                department_id: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            sub_module_permission: {
              select: {
                id: true,
                sub_module_action_id: true,
                action: true,
                sub_module: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            created_at: true,
            updated_at: true,
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
        },
      },
    });

    if (!roleWithPermissions || roleWithPermissions.is_active === false) {
      throw new BadRequestException('Role does not exist or is inactive');
    }

    const formattedRole = this.formatRolePermissions(roleWithPermissions);

    return {
      status: 'success',
      message: 'Here is the Role with its role permission',
      roleWithPermissions: formattedRole,
    };
  }

  async getUserWithRolePermission(user: RequestUser, userId: string) {
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

    const userRolePermission = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        user_permission: {
          select: {
            id: true,
            action: true,
            role_permission: {
              select: {
                id: true,
                role: {
                  select: {
                    id: true,
                    name: true,
                    department_id: true,
                    department: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                sub_module_permission: {
                  select: {
                    id: true,
                    sub_module_action_id: true,
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
            },
            sub_module_permission: {
              select: {
                id: true,
                sub_module_action_id: true,
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
        },
      },
    });

    if (!userRolePermission) {
      throw new NotFoundException('User not found or does not exist');
    }

    return {
      status: 'success',
      message:
        'Here is the user with its role permission(s) and direct permission(s)',
      userRolePermission,
    };
  }
}
