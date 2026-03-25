import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}
  // validate if module already exist
  async createModule(createModuleDto: CreateModuleDto, user: RequestUser) {
    const existingModule = await this.prisma.module.findFirst({
      where: {
        name: createModuleDto.name,
      },
    });

    if (existingModule) {
      throw new BadRequestException('Module already exists!');
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
        'You are not allowed to perform this action',
      );
    }

    const module = await this.prisma.module.create({
      data: {
        name: createModuleDto.name,
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

  async getModule(user: RequestUser, moduleId: string) {
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
            isActive: true,
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
      data: {
        module,
      },
    };
  }

  // with pagination
  async getModules(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    //PAGINATION AREA
    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.ModuleWhereInput = {
      isActive: true,
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
          isActive: search === 'true',
        });
      }

      whereCondition.OR = orConditions;
    }
    //prevent sorting by invalied fields (very important)
    const allowSortFeilds = ['name', 'created_at', 'updated_at', 'isActive'];
    const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';

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
              isActive: true,
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
      message: 'Here are the list of Sub Modules',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage),
      modules,
    };
  }

  async updateModude(
    updateModuleDto: UpdateModuleDto,
    user: RequestUser,
    id: string,
  ) {
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

    const updatedModule = await this.prisma.module.update({
      where: { id },
      data: {
        name: updateModuleDto.name,
        //stat: to add stat field in the future,
        updated_by: user.id,
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
