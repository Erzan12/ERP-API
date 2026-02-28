import {
  Injectable,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService) {}

  //get a single position
  async getPosition(id: string, user: RequestUser) {
    const position = await this.prisma.position.findUnique({
      where: { id },
    });

    if (!position) {
      throw new BadRequestException('Position not found.');
    }

    return {
      status: 'success',
      message: 'Here is the Position',
      data: {
        position,
      },
    };
  }

  //get all available and active positions
  async getPositions(
    user: RequestUser,
    dto: PaginationDto,
  ) {

    const { search, sortBy, order, page, perPage } = dto;

    const canView = await this.prisma.userRole.findFirst({
      where: {
        user_id: user.id,
        role_name: {
          in: [
            'Administrator',
            'Super Administrator',
            'HR Clerk',
            'HR Manager',
            'HR Staff',
          ],
        },
      },
    });

    if (!canView) {
      throw new BadRequestException(
        'You are not allowed to view this sub module',
      );
    }

    const skip = (page - 1) * perPage;

    const whereCondition: any = {
      stat: 1,
    };

    if (search) {
      //handle int and boolean search
      const orConditions: Prisma.PositionWhereInput[] = [];

      //string field search
      orConditions.push({
        name: {
          contains: search,
          mode: 'insensitive',
        },
      });

      // Division name (relation search)
      //scalable search if e.g in position table there is department_id PK and its UUID and youll be searching for name not the pk itself
      orConditions.push({
        department: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });

      //boolean search 
      // if ( search === 'true' || search === 'false' ) {
      //   orConditions.push({
      //     stat: search === 'true',
      //   })
      // }

      // number search
      if (!isNaN(Number(search))) {
        orConditions.push({
          sorting: Number(search),
        });
      }

      if (!isNaN(Number(search))) {
        orConditions.push({
          stat: Number(search),
        });
      }

      whereCondition.OR = orConditions;
    }

    const allowSortFeilds = ['id', 'created_at', 'updated_at', 'name', 'department_id', 'sorting'];
    if (!allowSortFeilds.includes(sortBy)) {
      sortBy;
    }

    const [ total, positions ] = await this.prisma.$transaction([
      this.prisma.position.count({
        where: {
          ...whereCondition,
        }
      }),
      this.prisma.position.findMany({
        where: {
          ...whereCondition,
        },
        skip,
        take: perPage,
        orderBy: {
          [sortBy]: order,
        },
      }),
    ]);

    if (positions.length === 0) {
      throw new BadRequestException('No available departments found.');
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
      throw new ForbiddenException('User is not allowed to view Departments');
    }

    return {
      status: 'success',
      message: 'Here are the list of Positions',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage),
      positions
    };
  }

  async createPosition(
    createPositionDto: CreatePositionDto,
    user: RequestUser,
  ) {
    const { name, department_id } = createPositionDto;

    console.log('createPositionDto:', createPositionDto);

    //Check for duplicate position name
    const existingPosition = await this.prisma.position.findFirst({
      where: { name: createPositionDto.name },
      select: {
        name: true,
        department: true,
        stat: true,
      },
    });

    if (existingPosition) {
      throw new ConflictException('Position already exist! Try again!');
    }

    //Create the new position
    const createdPosition = await this.prisma.position.create({
      data: {
        name,
        department: {
          connect: { id: createPositionDto.department_id }, // this links the foreign key
        },
      },
      include: {
        department: true,
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
      message: `${createdPosition.name} Position has been created successfully!`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      data: {
        position_id: createdPosition.id,
        position_name: createdPosition.name,
      },
    };
  }

  async updatePosition(
    id: string,
    updatePositionDto: UpdatePositionDto,
    user: RequestUser,
  ) {
    const { position_name, department_id, stat } = updatePositionDto;

    const position = await this.prisma.position.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        stat: true,
      },
    });

    if (!position) {
      throw new BadRequestException('Position not Found.');
    }

    if (position.stat === 0) {
      throw new ForbiddenException(
        `${position.name} Position status is inactive!`,
      );
    }

    if (updatePositionDto.department_id !== undefined) {
      const existingDept = await this.prisma.department.findFirst({
        where: { id: updatePositionDto.department_id },
      });

      if (!existingDept) {
        throw new BadRequestException('Department not found!');
      }
    }

    const updatePositionInfo = await this.prisma.position.update({
      where: { id },
      data: {
        name: position_name,
        sorting: updatePositionDto.sorting,
        department_id,
        stat,
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
      message: `${position.name} Position has been updated successfully!`,
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPosition,
      },
      updatePositionInfo,
    };
  }
}
