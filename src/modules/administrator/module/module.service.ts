import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}
  // validate if module already exist
  async createModule(createModuleDto: CreateModuleDto, user) {
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
      },
    });

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;

    const moduleCreate = await this.prisma.module.create({
      data: {
        name: createModuleDto.name,
        //to be added field of stat for status active or inactive
      },
    });

    return {
      status: 'success',
      message: `New module has been added to the system!`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      data: {
        module_id: moduleCreate.id,
        module_name: moduleCreate.name,
      },
    };
  }

  async getModule(user: RequestUser, id: string) {
    const availableSubModules = await this.prisma.subModule.findMany();

    if (!availableSubModules) {
      throw new BadRequestException('No available submodules for this module');
    }

    const module = await this.prisma.module.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return {
      status: 'success',
      message: `List of Sub Modules added to '${module.name}' Module`,
      data: {
        availableSubModules,
      },
    };
  }

  // async list of all the modules
  async getModules(user: RequestUser) {
    const modules = await this.prisma.module.findMany();

    if (!modules) {
      throw new NotFoundException('No available modules found!');
    }

    return {
      status: 'success',
      message: 'List of all the modules added!',
      data: {
        modules,
      },
    };
  }

  async updateMod(updateModuleDto: UpdateModuleDto, user: RequestUser, id: string) {
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
      message: `${updateModule.name} Module has been updated successfully!`,
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
