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

  async getSubModules(user: RequestUser, dto: SubModulePaginationDto) {
    const { search, module_id, sortBy, order, page, perPage } = dto;

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
          }
        }
      }
    })

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
            name: true
           }
          },
          sub_module_permissions: {
            // where: { 
            //   is_active: true 
            // }, 
            select: {
              id: true,
              action: true,
            }
          }
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
      subModule,
    };
  }

  //can be upgraded to when creating a submodule it can also set available permissions; right now it can just create submodules cant set permissions
  async createSubModule(dto: CreateSubModuleDto, user: RequestUser) {
    const { name, module_id, actions } = dto;

    const findModule = await this.prisma.module.findUnique({
      where: { id: dto.module_id },
    });
    if (!findModule) {
      throw new BadRequestException('Module not found!');
    }

    const subModule = await this.prisma.subModule.create({
      data: {
        name: dto.name,
        module_id: dto.module_id,
        created_by: user.id
      },
      include: {
        module: true,
      },
    });

    // Get all action definitions once
    const actionRecords =
      await this.prisma.subModuleAction.findMany({
        where: {
          action: {
            in: actions,
          },
          is_active: true
        },
      });

    const actionMap = new Map(
      actionRecords.map(action => [
        action.action,
        action,
      ]),
    );

    let createdSubModuleWithPermissions;

    for (const action of actions) {
      const actionRecord =
        actionMap.get(action);

      if (!actionRecord) {
        throw new BadRequestException ("Submodule Action not found");
      }

      await this.prisma.subModulePermission.create({
        data: {
          action,
          sub_module_id: subModule.id,
          sub_module_action_id:
            actionRecord.id,
            created_by: user.id
        },
      });
    };

    // Fetch permissions
    createdSubModuleWithPermissions =
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
      subModule: createdSubModuleWithPermissions
    };
  }

  async updateSubmodule(subModuleId: string, dto: UpdateSubmoduleDto, user: RequestUser) {
    const { name, module_id, is_active } = dto;

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
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];

    const canUpdate = requestUser.user_roles.some(role =>
      allowedRoles.includes(role.role_name),
    );

    if (!canUpdate) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    // Validate Submodule
    const existingSubModule =
      await this.prisma.subModule.findUnique({
        where: {
          id: subModuleId,
        },
      });

    if (!existingSubModule) {
      throw new BadRequestException(
        'Selected Sub Module does not exist',
      );
    }

    const subModule = await this.prisma.subModule.update({
      where: { id: subModuleId, is_active: true },
      data: {
        name: name ?? undefined,
        module_id: module_id ?? undefined,
        is_active: is_active ?? undefined,
        updated_by: user.id
      }
    })

    // Execute Transaction
    // const result = await this.prisma.$transaction(
    //   async tx => {
    //     // Update submodule details
    //     await tx.subModule.update({
    //       where: {
    //         id: subModuleId,
    //       },
    //       data: {
    //         ...(name && { name }),
    //         ...(is_active !== undefined && {
    //           is_active,
    //         }),
    //         updated_by: user.id,
    //       },
    //     });

    //     // Get current permissions
    //     const existingPermissions =
    //       await tx.subModulePermission.findMany({
    //         where: {
    //           id: subModuleId,
    //         },
    //       });

    //     const existingActions =
    //       existingPermissions.map(
    //         permission => permission.action,
    //       );

    //     const actionsToRemove =
    //       existingActions.filter(
    //         action => !actions.includes(action),
    //       );

    //     // Deactivate removed permissions
    //     if (actionsToRemove.length > 0) {
    //       await tx.subModulePermission.updateMany({
    //         where: {
    //           id: subModuleId,
    //           action: {
    //             in: actionsToRemove,
    //           },
    //         },
    //         data: {
    //           is_active: false,
    //           updated_by: user.id,
    //         },
    //       });
    //     }

    //     // Get all action definitions once
    //     const actionRecords =
    //       await tx.subModuleAction.findMany({
    //         where: {
    //           action: {
    //             in: actions,
    //           },
    //         },
    //       });

    //     const actionMap = new Map(
    //       actionRecords.map(action => [
    //         action.action,
    //         action,
    //       ]),
    //     );

    //     // Process incoming actions
    //     for (const action of actions) {
    //       const actionRecord =
    //         actionMap.get(action);

    //       if (!actionRecord) {
    //         continue;
    //       }

    //       const existingPermission =
    //         await tx.subModulePermission.findFirst({
    //           where: {
    //             id: subModuleId,
    //             action,
    //           },
    //         });

    //       if (existingPermission) {
    //         // Reactivate if previously disabled
    //         await tx.subModulePermission.update({
    //           where: {
    //             id: existingPermission.id,
    //           },
    //           data: {
    //             is_active: true,
    //             updated_by: user.id,
    //           },
    //         });actions
    //       } else {
    //         // Create new permission
    //         await tx.subModulePermission.create({
    //           data: {
    //             action,
    //             sub_module_id: subModuleId,
    //             sub_module_action_id:
    //               actionRecord.id,
    //             created_by: user.id,
    //           },
    //         });
    //       }
    //     }

    //     // Fetch updated permissions
    //     const updatedPermissions =
    //       await tx.subModulePermission.findMany({
    //         where: {
    //           id: subModuleId,
    //           is_active: true,
    //         },
    //         include: {
    //           sub_module: {
    //             select: {
    //               id: true,
    //               name: true,
    //             },
    //           },
    //         },
    //       });

    //     return updatedPermissions;
    //   },
    // );

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position?.name ?? '';

    return {
      status: 'success',
      message: 'Submodule updated successfully.',
      updated_by: `${userName} - ${userPos}`,
      subModule
      // data: {
      //   subModuleId,
      //   actions: result.map(
      //     permission => permission.action,
      //   ),
      //   sub_module: result[0]?.sub_module ?? {
      //     id: subModuleId,
      //     name,
      //   },
      // },
    };
  }

  async deleteSubmodule(subModuleId: string) {
    const subModule = await this.prisma.subModule.delete({
      where: { id: subModuleId },
      include: {
        sub_module_permissions: true,
      }
    })

    return {
      status: 'success',
      message: 'Submodule with permissions deleted',
      subModule
    }
  }

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

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    // const existingPermissions =
    //   await this.prisma.subModulePermission.findMany({
    //     where: {
    //       sub_module_id,
    //     },
    //     include: {
    //       sub_module_action: true,
    //     },
    //   });

    // const existingActions = existingPermissions.map(
    //   (p) => p.sub_module_action.action,
    // );

    // const actionsToDelete = existingPermissions
    //   .filter((p) => !action.includes(p.sub_module_action.action))
    //   .map((p) => p.id);

    // if (actionsToDelete.length > 0) {
    //   await this.prisma.subModulePermission.deleteMany({
    //     where: {
    //       id: {
    //         in: actionsToDelete,
    //       },
    //     },
    //   });
    // }

    // // Fetch existing permission definitions from AddedSubModPermission
    // const availablePermissions = await this.prisma.subModuleAction.findMany({
    //   where: {
    //     action: {
    //       in: action,
    //     },
    //     is_active: true,
    //   },
    // });

    // if (availablePermissions.length === 0) {
    //   throw new BadRequestException('No matching active permissions found.');
    // }
    
    // const actionsToCreate = availablePermissions.filter(
    //   (perm) => !existingActions.includes(perm.action),
    // );

    

    // // Create SubModulePermission entries using existing permission IDs
    // const subModulePermissionsToCreate = availablePermissions.map((perm) => ({
    //   sub_module_id,
    //   sub_module_action_id: perm.id,
    //   action: perm.action, // optional: only if you're storing this string too
    //   is_active: perm.is_active
    // }));

    // const result = await this.prisma.subModulePermission.createMany({
    //   data: subModulePermissionsToCreate,
    //   skipDuplicates: true,
    // });

    // const requestedCount = subModulePermissionsToCreate.length;
    // const createdCount = result.count;

    const existingPermissions =
      await this.prisma.subModulePermission.findMany({
        where: {
          sub_module_id,
        },
        include: {
          sub_module_action: true,
        },
      });

    const existingActions = existingPermissions.map(
      (p) => p.sub_module_action.action,
    );

    // Permissions to remove
    const actionsToDelete = existingPermissions
      .filter((p) => !action.includes(p.sub_module_action.action))
      .map((p) => p.id);

    // Valid actions from master table
    const availablePermissions =
      await this.prisma.subModuleAction.findMany({
        where: {
          action: {
            in: action,
          },
        },
      });

    if (availablePermissions.length !== action.length) {
      throw new BadRequestException(
        'One or more permissions do not exist.',
      );
    }

    // Permissions to add
    const actionsToCreate = availablePermissions.filter(
      (perm) => !existingActions.includes(perm.action),
    );

    const subModulePermissionsToCreate =
      actionsToCreate.map((perm) => ({
        sub_module_id,
        sub_module_action_id: perm.id,
        action: perm.action,
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

    const requestedCount = action.length;
    const createdCount = result.count;
    const deletedCount = actionsToDelete.length;

    let message = '';

    if (createdCount === 0) {
      message: `All selected permissions already exist in Sub Module ${subModule.name}`;
    } else if (createdCount < requestedCount) {
      message = `${createdCount} permissions(s) added. ${
        requestedCount - createdCount
      } permissions(s) already existed in Sub Module ${subModule.name}`;
    } else {
      message = `Added ${createdCount} permission(s) to Sub Module ${subModule.name}`;
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
        current_permissions: action,
      },
    };
  }
}
