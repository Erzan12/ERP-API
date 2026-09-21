import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateErCaseTypesOfOffenseDto,
  UpdateErCaseTypesOfOffenseDto,
} from './dto/types-of-offense.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ErCaseTypesOfOffensePaginationDto } from 'src/utils/dtos/er-related-pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ErCaseTypesOfOffenseService {
  constructor(private readonly prisma: PrismaService) {}

  async getTypeOfOffense(erCaseTypeOfOffenseId: string, user: RequestUser) {
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

    const erCaseTypeOfOffense =
      await this.prisma.hrErCaseTypeOfOffense.findUnique({
        where: { id: erCaseTypeOfOffenseId, is_active: true },
      });

    if (!erCaseTypeOfOffense || erCaseTypeOfOffense.is_active === false) {
      throw new BadRequestException(
        'Employee Relation Type of Offense does not exist or is inactive',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Employee Relation Type of Offense',
      erCaseTypeOfOffense,
    };
  }

  async getTypeOfOffenses(
    user: RequestUser,
    dto: ErCaseTypesOfOffensePaginationDto,
  ) {
    const { search, status, sortBy, order, page, perPage } = dto;

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

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.HrErCaseTypeOfOffenseWhereInput = {
      is_active: true,
    };

    if (status !== undefined) {
      whereCondition.is_active = status;
    }

    if (search) {
      const orConditions: Prisma.HrErCaseTypeOfOffenseWhereInput[] = [];

      orConditions.push({
        type_of_offense: {
          contains: search,
          mode: 'insensitive',
        },
      });

      whereCondition.OR = orConditions;
    }

    const allowSortFields = ['id', 'created_at', 'updated_at'];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, erCaseTypeOfOffenses] = await this.prisma.$transaction([
      this.prisma.hrErCaseTypeOfOffense.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.hrErCaseTypeOfOffense.findMany({
        where: {
          ...whereCondition,
        },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);

    if (erCaseTypeOfOffenses.length === 0) {
      throw new NotFoundException('No Type of Offenses yet added.');
    }

    return {
      status: 'success',
      message: 'Here is the list of Type of Offenses',
      count: total,
      page,
      perPage,
      erCaseTypeOfOffenses,
    };
  }

  async createTypeOfOffense(
    dto: CreateErCaseTypesOfOffenseDto,
    user: RequestUser,
  ) {
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

    const existingTypeOfOffense =
      await this.prisma.hrErCaseTypeOfOffense.findFirst({
        where: { type_of_offense: dto.type_of_offense, is_active: true },
      });

    if (existingTypeOfOffense) {
      throw new ConflictException('Type of Offense already existed.');
    }

    const typeOfOffense = await this.prisma.hrErCaseTypeOfOffense.create({
      data: {
        type_of_offense: dto.type_of_offense,
        description: dto.description,
        created_by: user.id,
      },
    });

    return {
      status: 'success',
      message:
        'Employee Relations Type of Offense has been created successfully',
      typeOfOffense,
    };
  }

  async updateTypeOfOffense(
    erCaseTypeOfOffenseId: string,
    dto: UpdateErCaseTypesOfOffenseDto,
    user: RequestUser,
  ) {
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

    const erCaseTypeOfOffense =
      await this.prisma.hrErCaseTypeOfOffense.findUnique({
        where: { id: erCaseTypeOfOffenseId },
      });

    if (!erCaseTypeOfOffense) {
      throw new BadRequestException(
        'Employee Relation Type of Offense does not exist or is inactive',
      );
    }

    const updateErCaseTypeOffense =
      await this.prisma.hrErCaseTypeOfOffense.update({
        where: { id: erCaseTypeOfOffenseId },
        data: {
          type_of_offense:
            dto.type_of_offense ?? erCaseTypeOfOffense.type_of_offense,
          description: dto.description ?? erCaseTypeOfOffense.description,
          is_active: dto.is_active,
          updated_by: user.id,
        },
      });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message:
        'Employee Relation Case Type of Offense has been updated successfully',
      updateErCaseTypeOffense,
      updated_by: `${userName} - ${userPosition}`,
    };
  }
}
