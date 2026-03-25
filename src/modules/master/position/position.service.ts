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
  async getPosition(positionId: string, user: RequestUser) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
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
    });

    if (!position) {
      throw new BadRequestException('Position not found.');
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
        'User is not allowed to perform this action',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Position',
      position,
    };
  }

  //get all available and active positions
  async getPositions(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.PositionWhereInput = {
      isActive: true,
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
      if (search === 'true' || search === 'false') {
        orConditions.push({
          isActive: search === 'true',
        });
      }

      // number search
      if (!isNaN(Number(search))) {
        orConditions.push({
          sorting: Number(search),
        });
      }

      whereCondition.OR = orConditions;
    }

    const allowSortFeilds = [
      'id',
      'created_at',
      'updated_at',
      'name',
      'department_id',
      'sorting',
    ];
    // if (!allowSortFeilds.includes(sortBy)) {
    //   sortBy;
    // }
    const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';

    const [total, positions] = await this.prisma.$transaction([
      this.prisma.position.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.position.findMany({
        where: {
          ...whereCondition,
        },
        include: {
          department: {
            include: {
              division: {
                select: {
                  id: true,
                  name: true,
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

    // if (positions.length === 0) {
    //   throw new BadRequestException('No available departments found.');
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

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];

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
      message: 'Here are the list of Positions',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage),
      positions,
    };
  }

  async createPosition(
    createPositionDto: CreatePositionDto,
    user: RequestUser,
  ) {
    const { name } = createPositionDto;

    // console.log('createPositionDto:', createPositionDto);

    //Check for duplicate position name
    const existingPosition = await this.prisma.position.findFirst({
      where: { name: createPositionDto.name },
      select: {
        name: true,
        department: true,
        isActive: true,
      },
    });

    if (existingPosition) {
      throw new ConflictException('Position already exist! Try again!');
    }

    //Create the new position
    const position = await this.prisma.position.create({
      data: {
        name,
        hierarchy: createPositionDto.hierarchy ?? null,
        job_description: createPositionDto.job_description ?? null,
        sorting: createPositionDto.sorting ?? null,
        department: {
          connect: { id: createPositionDto.department_id }, // this links the foreign key -> relation type -> linked object use relation to get department id
        },
        createdBy: {
          connect: { id: user.id },
        },
        // created_by: user.id, // scalar type approach -> column value direct column value from related table
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
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
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${position.name} position has been created successfully!`,
      position,
      created_by_user: `${userName} - ${userPosition}`,
    };
  }

  async updatePosition(
    positionId: string,
    updatePositionDto: UpdatePositionDto,
    user: RequestUser,
  ) {
    const existingPosition = await this.prisma.position.findUnique({
      where: { id: positionId },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!existingPosition) {
      throw new BadRequestException('Position not Found.');
    }

    // if (existingPosition.stat === 0) {
    //   throw new ForbiddenException(
    //     `${existingPosition.name} Position status is inactive!`,
    //   );
    // }

    if (updatePositionDto.department_id !== undefined) {
      const existingDept = await this.prisma.department.findFirst({
        where: { id: updatePositionDto.department_id },
      });

      if (!existingDept) {
        throw new BadRequestException('Department not found!');
      }
    }

    const updateData: Prisma.PositionUpdateInput = {
      name: updatePositionDto.name ?? undefined,
      hierarchy: updatePositionDto.hierarchy,
      job_description: updatePositionDto.job_description ?? undefined,
      sorting: updatePositionDto.sorting ?? undefined,
      isActive: updatePositionDto.isActive ?? undefined,
      updatedBy: {
        connect: { id: user.id },
      },
    };

    if (updatePositionDto.department_id !== undefined) {
      updateData.department = {
        connect: { id: updatePositionDto.department_id },
      };
    }

    const position = await this.prisma.position.update({
      where: { id: positionId },
      data: updateData,
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
      message: `${position.name} position has been updated successfully!`,
      position,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }
}
