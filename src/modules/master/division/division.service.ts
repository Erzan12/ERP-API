import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateDivisionDto, UpdateDivisionDto } from './dto/division.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DivisionService {
  constructor(private prisma: PrismaService) {}

  //query single division
  async getDivision(divisionId: string, user: RequestUser) {
    const division = await this.prisma.division.findUnique({
      where: { id: divisionId },
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

    if (!division) {
      throw new BadRequestException('Division not found!');
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
      message: 'Here is the Division',
      division,
    };
  }

  //query all available divisions
  async getDivisions(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.DivisionWhereInput = {
      isActive: true,
    };

    //for string type search columns
    const stringFields = ['name', 'division_head_id'];

    if (search) {
      //handle int and boolean search
      const orConditions: Prisma.DivisionWhereInput[] = [];

      //string search
      orConditions.push(
        ...stringFields.map((field) => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      );

      //boolean search
      if (search === 'true' || search === 'false') {
        orConditions.push({
          isActive: search === 'true',
        });
      }

      whereCondition.OR = orConditions;
    }

    const allowSortFeilds = [
      'id',
      'created_at',
      'updated_at',
      'name',
      'division_head_id',
    ];
    // if (!allowSortFeilds.includes(sortBy)) {
    //   sortBy;
    // }
    const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';

    const [total, divisions] = await this.prisma.$transaction([
      this.prisma.division.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.division.findMany({
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

    // if (divisions.length === 0) {
    //   throw new BadRequestException('No available divisions found');
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
      message: 'Here are the list of Divisions',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage),
      divisions,
    };
  }

  async createDivision(
    createDivisionDto: CreateDivisionDto,
    user: RequestUser,
  ) {
    const { name, division_head_id } = createDivisionDto;

    const existingDivision = await this.prisma.division.findFirst({
      where: {
        name: createDivisionDto.name,
        division_head_id: createDivisionDto.division_head_id,
      },
    });

    if (existingDivision) {
      throw new ConflictException('Division already exists!');
    }

    const division = await this.prisma.division.create({
      data: {
        name,
        division_head_id,
        created_by: user.id,
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
      message: `${division.name} Division has been created successfully!`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      division: division,
    };
  }

  async updateDivision(
    divisionId: string,
    updateDivisionDto: UpdateDivisionDto,
    user: RequestUser,
  ) {
    const division = await this.prisma.division.findUnique({
      where: { id: divisionId },
      select: {
        name: true,
        isActive: true,
      },
    });

    if (!division) {
      throw new BadRequestException('Department does not exist!');
    }

    const updateDivision = await this.prisma.division.update({
      where: { id: divisionId },
      data: {
        name: updateDivisionDto.name ?? undefined,
        isActive: updateDivisionDto.isActive ?? undefined,
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
      message: `${updateDivision.name} Division has been updated successfully`,
      // updated_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      updateDivision,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }
}
