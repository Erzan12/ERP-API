import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ModulePaginationDto } from 'src/utils/dtos/module-pagination.dto';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  async getModule(user: RequestUser, moduleId: string) {
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

    const subModules = await this.prisma.subModule.findMany();

    if (subModules.length === 0) {
      throw new NotFoundException('No available submodules for this module');
    }

    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        sub_module: {
          select: {
            id: true,
            name: true,
            is_active: true,
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

    if (!module) {
      throw new NotFoundException('Module does not exist');
    }

    return {
      status: 'success',
      message: 'Here is the module with its submodule',
      module,
    };
  }

  // with pagination
  async getModules(user: RequestUser, dto: ModulePaginationDto) {
    const { search, sub_module_id, sortBy, order, page, perPage } = dto;

    //PAGINATION AREA
    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.ModuleWhereInput = {
      is_active: true,
    };

    if (search) {
      //handle int and boolean search
      const orConditions: Prisma.ModuleWhereInput[] = [];

      //no map approach if table columns are not that many e.g name column and stat column only
      orConditions.push({
        name: {
          contains: search,
          mode: 'insensitive',
        },
      });

      //boolean search
      if (search === 'true' || search === 'false') {
        orConditions.push({
          is_active: search === 'true',
        });
      }

      whereCondition.OR = orConditions;
    }

    await this.prisma.subModule.findFirst({
      where: { id: sub_module_id, is_active: true },
      select: {
        module: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (sub_module_id) {
      const existingSubModule = await this.prisma.subModule.findFirst({
        where: {
          id: sub_module_id,
          is_active: true,
        },
      });

      if (!existingSubModule) {
        throw new NotFoundException('Submodule does not exist');
      }

      // whereCondition.sub_module = {
      //   some: {
      //     id: sub_module_id,
      //     is_active: true,
      //   },
      // };

      // alternate
      whereCondition.id = existingSubModule.module_id;
    }

    //prevent sorting by invalied fields (very important)
    const allowSortFields = ['name', 'created_at', 'updated_at', 'isActive'];
    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, modules] = await this.prisma.$transaction([
      this.prisma.module.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.module.findMany({
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
          sub_module: {
            select: {
              id: true,
              name: true,
              is_active: true,
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

    // if (modules.length === 0) {
    //   throw new NotFoundException('No available modules found!');
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
      message: 'Here are the list of Modules',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage),
      modules,
    };
  }

  async createModule(dto: CreateModuleDto, user: RequestUser) {
    const { name } = dto;
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

    const existingModule = await this.prisma.module.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (existingModule) {
      throw new BadRequestException('Module already exists!');
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const module = await this.prisma.module.create({
      data: {
        name: name,
        slug,
        //to be added field of stat for status active or inactive
        createdBy: {
          connect: { id: user.id },
        },
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `New module has been added to the system!`,
      // created_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      module,
      created_by_user: `${userName} - ${userPosition}`,
    };
  }

  async updateModude(dto: UpdateModuleDto, user: RequestUser, id: string) {
    const { name, is_active } = dto;

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

    const existingModule = await this.prisma.module.findUnique({
      where: { id },
      select: {
        name: true,
        //to add stat for status
      },
    });

    if (!existingModule) {
      throw new NotFoundException(
        `${existingModule} Module does not exist or inactive!`,
      );
    }

    const slug = name
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const updatedModule = await this.prisma.module.update({
      where: { id },
      data: {
        name: name,
        slug,
        is_active,
        //stat: to add stat field in the future,
        updated_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `Module has been updated successfully!`,
      // updated_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      updatedModule,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }
}
