import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { AssignSubModulePermissionDto } from './dto/assign-sub-module-permission.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { AddSubModulePermissionDto } from './dto/add-sub-module-permission.dto';
import { UpdateSubModulePermisisonDto } from './dto/update-sub-module-permisison.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubModuleService {
  constructor(private prisma: PrismaService) {}

  async getSubModules(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

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
      message: 'Here are the list of Sub Modules',
      count: total,
      page,
      perPage,
      // totalPage: Math.ceil(total / perPage),
      subModules,
    };
  }

  async getSubmodule(subModuleId: string, user: RequestUser) {
    const subModule = await this.prisma.subModule.findUnique({
      where: { id: subModuleId },
      include: {
        module: true,
        role_permission: true,
        sub_module_permissions: true,
      },
    });

    if (!subModule) {
      throw new NotFoundException('Submodule not found');
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
        role.role_name === 'Administrator' || 'Super Administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Submodule',
      data: {
        subModule,
      },
    };
  }

  //can be upgraded to when creating a submodule it can also set available permissions; right now it can just create submodules cant set permissions
  async createSubModule(
    createSubModuleDto: CreateSubModuleDto,
    user: RequestUser,
  ) {
    const findModule = await this.prisma.module.findUnique({
      where: { id: createSubModuleDto.module_id },
    });
    if (!findModule) {
      throw new BadRequestException('Module not found!');
    }

    const subModule = await this.prisma.subModule.create({
      data: {
        name: createSubModuleDto.name,
        module_id: createSubModuleDto.module_id,
      },
      include: {
        module: true,
      },
    });

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

    return {
      status: 'success',
      message: `Sub Module ${subModule.name} for Module ${subModule.module.name} has been added`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      subModule_id: subModule.id,
      subModule_name: subModule.name,
    };
  }

  async getSubModuleActions(user: RequestUser) {
    const modules = await this.prisma.subModuleAction.findMany();

    if (modules.length === 0) {
      throw new NotFoundException(
        'No Submodule actions yet available or added',
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

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const isAdmin = requestUser.user_roles.some(
      (role) =>
        // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
        role.role_name === 'Administrator' || 'Super Administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return {
      status: 'success',
      message: 'Here is the list of Submodule Actions available',
      modules,
    };
  }

  //add new submodule permission -> acts as inventory of all permisison/actions that can be assigned to a submodule
  async addSubModuleAction(dto: AddSubModulePermissionDto, user: RequestUser) {
    const { action } = dto;

    const permissionsToCreate = action.map((act) => ({
      action: act,
    }));

    const subModuleAction = await this.prisma.subModuleAction.createMany({
      data: permissionsToCreate,
      skipDuplicates: true, // Optional: skips duplicate "action" entries
    });

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

    return {
      status: 'success',
      message: `Added ${subModuleAction.count} new permission(s).`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      count: subModuleAction.count,
      actions_added: action,
    };
  }

  async updateSubModuleAction(
    dto: UpdateSubModulePermisisonDto,
    user: RequestUser,
    subModulePermissionId: string,
  ) {
    const { action, is_active } = dto;

    const existingSubModulePermission =
      await this.prisma.subModuleAction.findFirst({
        where: { id: subModulePermissionId },
      });

    if (!existingSubModulePermission) {
      throw new NotFoundException('Sub Module permission does not exist!');
    }

    // if (existingSubModulePermission.stat === 0) {
    //     throw new ForbiddenException(`${existingSubModulePermission.action} action status is inactive`);
    // }

    const updateSubModulePermission = await this.prisma.subModuleAction.update({
      where: { id: subModulePermissionId },
      data: {
        id: existingSubModulePermission.id,
        action,
        is_active,
      },
    });

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

    return {
      status: 'success',
      message: `${existingSubModulePermission.action} action has been updated successfully!`,
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      data: {
        updateSubModulePermission,
      },
    };
  }

  // }
  async assignSubModulePermissions(
    dto: AssignSubModulePermissionDto,
    user: RequestUser,
  ) {
    const { action, sub_module_id } = dto;

    const subModule = await this.prisma.subModule.findFirst({
      where: { id: sub_module_id },
      include: {
        module: true,
      },
    });

    if (!subModule) {
      throw new NotFoundException('Sub Module does not exist!');
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
    const userPos = requestUser.employee.position.name;

    // ✅ Fetch existing permission definitions from AddedSubModPermission
    const availablePermissions = await this.prisma.subModuleAction.findMany({
      where: {
        action: {
          in: action,
        },
        is_active: true,
      },
    });

    if (availablePermissions.length === 0) {
      throw new BadRequestException('No matching active permissions found.');
    }

    // ✅ Create SubModulePermission entries using existing permission IDs
    const subModulePermissionsToCreate = availablePermissions.map((perm) => ({
      sub_module_id,
      sub_module_action_id: perm.id,
      action: perm.action, // optional: only if you're storing this string too
    }));

    const result = await this.prisma.subModulePermission.createMany({
      data: subModulePermissionsToCreate,
      skipDuplicates: true,
    });

    return {
      status: 'success',
      message: `Added permissions to Sub Module ${subModule.name}`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      data: {
        result,
      },
    };
  }

  // async unassignSubmodulePermissions(unassignSubmodulePermissionsDto: UnassignSubmodulePermissionsDto, user) {
  //     const { sub_module_id, sub_module_permission_id } = unassignSubmodulePermissionsDto;

  //     const existingSubModule= await this.prisma.subModule.findFirst({
  //         where: { id: unassignSubmodulePermissionsDto.sub_module_id },
  //     });

  //     if (!existingSubModule){
  //         throw new BadRequestException('Selected Sub Module does not exist');
  //     }

  //     const existingSubModulePermission = await this.prisma.subModulePermission.findMany({
  //         where: { id: {
  //             in: unassignSubmodulePermissionsDto.sub_module_permission_id
  //         },
  //     },
  //     });

  //     if(!existingSubModulePermission){
  //         throw new BadRequestException('Selected Sub Module Permissions does not exist');
  //     };

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

  //     const unassignSubmodulePermissions = await this.prisma.subModulePermission.updateMany({
  //         where: {
  //             id: {

  //             }
  //         },
  //         data: {
  //             stat: 1,
  //         }
  //     })

  //     return {
  //         status: 'success',
  //         message: `New module has been added to the system!`,
  //         created_by: {
  //                 id: requestUser.id,
  //                 name: userName,
  //                 position: userPos,
  //         },
  //         data: {
  //             unassignSubmodulePermissions
  //         }
  //     }
  // }
}
