import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateSubModuleDto, UpdateSubmoduleDto } from './dto/sub-module.dto';
import { AssignSubModulePermissionDto } from './dto/assign-sub-module-permission.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SubModulePaginationDto } from 'src/utils/dtos/module-pagination.dto';

@Injectable()
export class SubModuleService {
  constructor(private prisma: PrismaService) {}

  //formatted submodule with permission query
  // private formatSubmodulePermission(submodule: SubmoduleWithPermission) {
  //   const { }
  // }

  async getSubModules(user: RequestUser, dto: SubModulePaginationDto) {
    const { search, module_id, sortBy, order, page, perPage } = dto;

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

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.SubModuleWhereInput = {
      is_active: true,
    };

    if (search) {
      const orConditions: Prisma.SubModuleWhereInput[] = [];

      orConditions.push({
        name: {
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

    await this.prisma.module.findFirst({
      where: { id: module_id, is_active: true },
      select: {
        sub_module: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (module_id) {
      const existingModule = await this.prisma.module.findFirst({
        where: {
          id: module_id,
          is_active: true,
        },
      });

      if (!existingModule) {
        throw new NotFoundException('Module does not exist');
      }

      whereCondition.module_id = module_id;
    }

    const allowSortFields = ['name', 'module_id', 'created_at', 'updated_at'];
    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, subModules] = await this.prisma.$transaction([
      this.prisma.subModule.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.subModule.findMany({
        where: {
          ...whereCondition,
        },
        include: {
          module: {
            select: {
              id: true,
              name: true,
            },
          },
          sub_module_permissions: {
            // where: {
            //   is_active: true
            // },
            select: {
              id: true,
              action: true,
              role_permissions: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        // select: {
        //   id: true,
        //   name: true,
        //   module_id: true,
        //   module: {
        //     select: {
        //       id: true,
        //       name: true,
        //       stat: true,
        //     },
        //   },
        // },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);

    // if (subModules.length === 0) {
    //   throw new BadRequestException('No available or active sub module exist!');
    // }

    return {
      status: 'success',
      message: 'Here are the list of Sub Modules',
      count: total,
      page,
      perPage,
      // totalPage: Math.ceil(total / perPage),
      subModules,
    };
  }

  async getSubmodule(subModuleId: string, user: RequestUser) {
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

    const allowedRoles = ['Administrator', 'Super Administrator'];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const subModule = await this.prisma.subModule.findUnique({
      where: { id: subModuleId },
      include: {
        module: {
          select: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        sub_module_permissions: {
          select: {
            id: true,
            action: true,
          },
        },
      },
    });

    if (!subModule) {
      throw new NotFoundException('Submodule not found');
    }

    return {
      status: 'success',
      message: 'Here is the Submodule',
      subModule,
    };
  }

  //can be upgraded to when creating a submodule it can also set available permissions; right now it can just create submodules cant set permissions
  async createSubModule(dto: CreateSubModuleDto, user: RequestUser) {
    const { name, module_id, subModuleActionId = [] } = dto;

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

    const allowedRoles = ['Administrator', 'Super Administrator'];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const findModule = await this.prisma.module.findUnique({
      where: { id: module_id },
    });
    if (!findModule) {
      throw new BadRequestException('Module not found!');
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const subModule = await this.prisma.subModule.create({
      data: {
        name: name,
        slug,
        module_id: module_id,
        created_by: user.id,
      },
      include: {
        module: true,
      },
    });

    if (subModuleActionId?.length) {
      // Get all action definitions once
      const actionRecords = await this.prisma.subModuleAction.findMany({
        where: {
          id: {
            in: subModuleActionId,
          },
          is_active: true,
        },
      });

      const actionMap = new Map(
        actionRecords.map((action) => [action.id, action]),
      );

      for (const actionId of subModuleActionId) {
        const actionRecord = actionMap.get(actionId);

        if (!actionRecord) {
          throw new BadRequestException('Submodule Action not found');
        }

        await this.prisma.subModulePermission.create({
          data: {
            action: actionRecord.action,
            sub_module_id: subModule.id,
            sub_module_action_id: actionRecord.id,
            created_by: user.id,
          },
        });
      }
    }

    let createdSubModuleWithPermissions;

    // Fetch permissions
    await this.prisma.subModule.findFirst({
      where: {
        id: subModule.id,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        module_id: true,
        is_active: true,
        created_by: true,
        created_at: true,
        sub_module_permissions: {
          select: {
            id: true,
            action: true,
          },
        },
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `Sub Module ${subModule.name} for Module ${subModule.module.name} has been added`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      subModule: createdSubModuleWithPermissions,
    };
  }

  async updateSubmodule(
    subModuleId: string,
    dto: UpdateSubmoduleDto,
    user: RequestUser,
  ) {
    const { name, module_id, is_active } = dto;

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

    const canUpdate = requestUser.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canUpdate) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    // Validate Submodule
    const existingSubModule = await this.prisma.subModule.findUnique({
      where: {
        id: subModuleId,
      },
    });

    if (!existingSubModule) {
      throw new BadRequestException('Selected Sub Module does not exist');
    }

    const slug = name
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const subModule = await this.prisma.subModule.update({
      where: { id: subModuleId, is_active: true },
      data: {
        name: name,
        module_id: module_id,
        slug,
        is_active: is_active,
        updated_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position?.name ?? '';

    return {
      status: 'success',
      message: 'Submodule updated successfully.',
      updated_by: `${userName} - ${userPos}`,
      subModule,
    };
  }

  async deleteSubmodule(subModuleId: string) {
    const subModule = await this.prisma.subModule.delete({
      where: { id: subModuleId },
      include: {
        sub_module_permissions: true,
      },
    });

    return {
      status: 'success',
      message: 'Submodule with permissions deleted',
      subModule,
    };
  }

  async assignSubModulePermissions(
    dto: AssignSubModulePermissionDto,
    user: RequestUser,
  ) {
    const { sub_module_actions_id, sub_module_id } = dto;

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

    const existingSubModule = await this.prisma.subModule.findFirst({
      where: { id: sub_module_id },
      include: {
        module: true,
      },
    });

    if (!existingSubModule) {
      throw new NotFoundException('Sub Module does not exist!');
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    const existingPermissions = await this.prisma.subModulePermission.findMany({
      where: {
        sub_module_id,
      },
      include: {
        sub_module_action: {
          select: {
            id: true,
            action: true,
          },
        },
      },
    });

    const existingActions = existingPermissions.map(
      (p) => p.sub_module_action.id,
    );

    // Permissions to remove
    const actionsToDelete = existingPermissions
      .filter((p) => !sub_module_actions_id.includes(p.sub_module_action_id))
      .map((p) => p.id);

    // Valid actions from master table
    const availablePermissions = await this.prisma.subModuleAction.findMany({
      where: {
        id: {
          in: sub_module_actions_id,
        },
      },
    });

    if (availablePermissions.length !== sub_module_actions_id.length) {
      throw new BadRequestException('One or more permissions does not exist.');
    }

    // Permissions to add
    const actionsToCreate = availablePermissions.filter(
      (perm) => !existingActions.includes(perm.id),
    );

    const subModulePermissionsToCreate = actionsToCreate.map((perm) => ({
      sub_module_id,
      sub_module_action_id: perm.id,
      action: perm.action,
      code: `${existingSubModule.slug}:${perm.slug}`,
      created_by: user.id,
    }));

    const result = await this.prisma.$transaction(async (tx) => {
      if (actionsToDelete.length > 0) {
        await tx.subModulePermission.deleteMany({
          where: {
            id: {
              in: actionsToDelete,
            },
          },
        });
      }

      return tx.subModulePermission.createMany({
        data: subModulePermissionsToCreate,
        skipDuplicates: true,
      });
    });

    const updatedSubModule = await this.prisma.subModule.findUnique({
      where: {
        id: sub_module_id,
      },
      select: {
        id: true,
        name: true,
        module_id: true,
        is_active: true,
        updated_at: true,
        sub_module_permissions: {
          select: {
            id: true,
            action: true,
          },
          orderBy: {
            action: 'asc',
          },
        },
      },
    });

    const requestedCount = sub_module_actions_id.length;
    const createdCount = result.count;
    const deletedCount = actionsToDelete.length;

    let message = '';

    if (createdCount === 0) {
      message = `All selected permissions already exist in Sub Module ${existingSubModule.name}.`;
    } else if (createdCount < requestedCount) {
      message = `${createdCount} permission(s) added. ${
        requestedCount - createdCount
      } permission(s) already existed in Sub Module ${existingSubModule.name}`;
    } else {
      message = `Added ${createdCount} permission(s) to Sub Module ${existingSubModule.name}`;
    }

    return {
      status: 'success',
      message,
      // message: `Updated permissions for Sub Module ${subModule.name}`,
      created_by: `${userName} - ${userPosition}`,
      subModule: updatedSubModule,
      data: {
        requested: requestedCount,
        created: createdCount,
        deleted: deletedCount,
        current_permissions: sub_module_actions_id,
      },
    };
  }
}
