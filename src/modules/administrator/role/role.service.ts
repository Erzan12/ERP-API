import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  //Add Get Role -> to query the roles available
  async getRoles(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.RoleWhereInput = {
      isActive: true,
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

  async getRole(id: string, user: RequestUser) {
    const role = await this.prisma.role.findUnique({
      where: { id },
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

    if (!role) {
      throw new NotFoundException('Role does not exist');
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

  async createRole(createRoleDto: CreateRoleDto, user: RequestUser) {
    const { name, description } = createRoleDto;

    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new BadRequestException('Role already exist! Try again');
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
      },
    });

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    const role = await this.prisma.role.create({
      data: {
        name,
        description,
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
    const existingRole = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      throw new BadRequestException('Role does not exist!');
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
      },
    });

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    const role = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        name: dto.name ?? undefined,
        description: dto.description ?? undefined,
        updated_by: user.id,
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
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }

  //Add Get submodule permission -> to query the submodule permission table for available submolues with permission
  async createRolePermissions(
    createRolePermissionDto: CreateRolePermissionDto,
    user: RequestUser,
  ) {
    const { action, sub_module_id, role_id, department_id, position_id } =
      createRolePermissionDto;

    const existingRole = await this.prisma.role.findFirst({
      where: { id: role_id },
    });

    if (!existingRole) {
      throw new BadRequestException('Role not found or does not exist!');
    }

    const validSubModuleActions =
      await this.prisma.subModulePermission.findMany({
        where: { sub_module_id },
      });

    const validActions = validSubModuleActions.map((perm) => perm.action);

    const invalidActions = action.filter((act) => !validActions.includes(act));

    if (invalidActions.length > 0) {
      throw new BadRequestException(
        `Invalid action(s) for this sub module: ${invalidActions.join(', ')}`,
      );
    }

    // to map the role_name and sub_module_permission_id so it wont return null in prisma studio
    const subModulePermissionMap = new Map(
      validSubModuleActions.map((perm) => [perm.action, perm.id]),
    );

    const createRolePermission = action.map((act) => ({
      action: act,
      sub_module_id,
      role_id,
      role_name: existingRole.name,
      sub_module_permission_id: subModulePermissionMap.get(act)!, // ! to asset sub_mobule_permission id if it is always defined and cannot be null
      department_id,
      position_id,
    }));

    await this.prisma.rolePermission.createMany({
      data: createRolePermission,
      skipDuplicates: true,
    });

    const rolePermission = await this.prisma.role.findFirst({
      where: { id: role_id },
    });

    if (!rolePermission) {
      throw new BadRequestException('Role Permission does not exist');
    }

    const requestUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: {
          include: {
            person: true,
            position: true,
            department: true,
          },
        },
        user_roles: true,
      },
    });

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;
    const userRole = requestUser.user_roles.map((r) => r.role_name);

    return {
      status: 'success',
      message: `Added permissions to Role ${rolePermission?.name}`,
      created_by: {
        id: requestUser.id,
        name: userName,
        department: requestUser.employee.department,
        position: userPos,
        role: userRole,
      },
      role_id: rolePermission.id,
      role_name: rolePermission.name,
    };
  }

  async updateRolePermissions(
    id: string,
    updateRolePermissionsDto: UpdateRolePermissionsDto,
    user: RequestUser,
  ) {
    const { action_updates = [] } = updateRolePermissionsDto;

    const existingRole = await this.prisma.role.findUnique({
      where: { id },
      include: {
        role_permissions: true,
      },
    });

    if (!existingRole) {
      throw new BadRequestException('Role does not exist!');
    }

    if (existingRole.role_permissions.length === 0) {
      throw new BadRequestException('This role has no existing role to update');
    }

    const toUpdate = existingRole.role_permissions.filter((perm) =>
      action_updates.some((update) => update.currentAction === perm.action),
    );

    const requestUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: {
          include: {
            person: true,
            position: true,
          },
        },
      },
    });

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;

    const results = await Promise.all(
      toUpdate.map((perm) => {
        const updateData = action_updates.find(
          (u) => u.currentAction === perm.action,
        );

        if (!updateData) {
          throw new ForbiddenException('Updating action failed');
        }

        return this.prisma.rolePermission.update({
          where: { id: perm.id },
          data: {
            action: updateData.newAction,
          },
        });
      }),
    );
    return {
      status: 'success',
      message: 'Role Permission successfully updated',
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      updated_data: {
        results,
      },
    };
  }

  // //unassing currently selected role permission
  // async unassignRolePermission(unassignRolePermissionDto: UnassignRolePermissionDto, user) {
  //     const { sub_module_id, role_permission_id } = unassignRolePermissionDto;

  //     const requestUser = await this.prisma.user.findUnique({
  //         where: { id: user.id },
  //         include:{
  //             employee: {
  //                 include: {
  //                     person: true,
  //                     position: true,
  //                 }
  //             }
  //         }
  //     })

  //     if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
  //         throw new BadRequestException(`User does not exist.`);
  //     }

  //     const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
  //     const userPos = requestUser.employee.position.name;

  //     const existingSubModule = await this.prisma.subModule.findFirst({
  //         where: { id: unassignRolePermissionDto.sub_module_id },
  //         include: {
  //             role_permission: {
  //                 include: {
  //                     role: true,
  //                 },
  //             },
  //         },
  //     });

  //     if(!existingSubModule){
  //         throw new BadRequestException('Selected Sub Module does not exist');
  //     }

  //     const existingRolePermission = await this.prisma.rolePermission.findMany({
  //         where: { id: {
  //             in: unassignRolePermissionDto.role_permission_id
  //             },
  //         },
  //     });

  //     if(!existingRolePermission){
  //         throw new BadRequestException('Selected Role Permission does not exist in this Sub Module');
  //     };

  //     const unassignedRolePermission = await this.prisma.rolePermission.updateMany({
  //         where: {
  //             id: {
  //                 in: unassignRolePermissionDto.role_permission_id,
  //             },
  //             sub_module_id: unassignRolePermissionDto.sub_module_id,
  //             status: true, // Only update active assignments
  //         },
  //         data: {
  //             status: false, // Mark as unassigned
  //         },
  //     });

  //     return {
  //         status: 'success',
  //         message: 'You have successfuly update a role permission',
  //         updated_by: {
  //                 id: requestUser.id,
  //                 name: userName,
  //                 position: userPos,
  //             },
  //         data: {
  //             unassignedRolePermission
  //         },
  //     };
  // }
}
