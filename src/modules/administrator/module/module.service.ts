import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}
  // validate if module already exist
  async createModule(createModuleDto: CreateModuleDto) {
    const existingModule = await this.prisma.module.findFirst({
      where: {
        name: createModuleDto.name,
      },
    });

    if (existingModule) {
      throw new BadRequestException('Module already exists!');
    }

    // const requestUser = await this.prisma.user.findUnique({
    //   where: { id: user.id },
    //   include: {
    //     employee: {
    //       include: {
    //         person: true,
    //         position: true,
    //       },
    //     },
    //   },
    // });

    // if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
    //   throw new BadRequestException(`User does not exist.`);
    // }

    // const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    // const userPos = requestUser.employee.position.name;

    const moduleCreate = await this.prisma.module.create({
      data: {
        name: createModuleDto.name,
        //to be added field of stat for status active or inactive
      },
    });

    return {
      status: 'success',
      message: `New module has been added to the system!`,
      // created_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      data: {
        module_id: moduleCreate.id,
        module_name: moduleCreate.name,
      },
    };
  }

  async getModule(user: RequestUser, id: string) {
    const subModules = await this.prisma.subModule.findMany();

    if (subModules.length === 0) {
      throw new NotFoundException('No available submodules for this module');
    }

    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        sub_module: true,
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

  // async getSubModulePerModule(user: RequestUser, id: string) {
  //   const availableSubModules = await this.prisma.subModule.findMany();

  //   if (!availableSubModules) {
  //     throw new BadRequestException('No available submodules for this module');
  //   }

  //   const module = await this.prisma.module.findUnique({
  //     where: { id },
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //   });

  //   if (!module) {
  //     throw new NotFoundException(`Module with ID ${id} not found`);
  //   }

  //   return {
  //     status: 'success',
  //     message: `List of Sub Modules added to '${module.name}' Module`,
  //     data: {
  //       availableSubModules,
  //     },
  //   };
  // }

  // async list of all the modules
  // async getModules(user: RequestUser) {
  //   const modules = await this.prisma.module.findMany({
  //     where: { stat: 1 },
  //     include: {
  //       sub_module: true,
  //     }
  //   });

  //   if (modules.length === 0) {
  //     throw new NotFoundException('No available modules found!');
  //   }

  //   return {
  //     status: 'success',
  //     message: 'Here are the list of Sub Modules',
  //     data: {
  //       modules,
  //     },
  //   };
  // }

  // with pagination
  async getModules(
    user: RequestUser,
    page = 1,
    perPage = 10,
    search?: string,
    sortBy: string = 'created_at',
    order: 'asc' | 'desc' = 'asc',
  ) {
    const skip = (page - 1) * perPage;

    const whereCondition: any = {
      stat: 1,
    };

    //search query
    if (search) {
      whereCondition.name = {
        contains: search,
        mode: 'insensitive', //postgresql case-insensitive
      };
    }
    //prevent sorting by invalied fields (very important)
    const allowSortFeilds = ['name', 'created_at', 'updated_at'];
    if (!allowSortFeilds.includes(sortBy)) {
      sortBy = 'created_at';
    }

    const [total, modules] = await this.prisma.$transaction([
      this.prisma.module.count({
        where: whereCondition,
      }),
      this.prisma.module.findMany({
      where: whereCondition,
        include: {
          sub_module: true,
        },
        skip,
        take: perPage,
        orderBy: {
          [sortBy]: order,
        },
      }),
    ]);

    if (modules.length === 0) {
      throw new NotFoundException('No available modules found!');
    }

    return {
      status: 'success',
      message: 'Here are the list of Sub Modules',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage),
      data: modules,
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

    const updateModule = await this.prisma.module.update({
      where: { id },
      data: {
        name: updateModuleDto.name,
        //stat: to add stat field in the future,
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
      message: `Module has been updated successfully!`,
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      data: {
        module_id: updateModule.id,
        module_name: updateModule.name,
      },
    };
  }

  // async to edit/update the module
}
