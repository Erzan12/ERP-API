import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  CreateSalaryGradeDto,
  UpdateSalaryGradeDto,
} from './dto/salary-grade.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalaryGradeService {
  constructor(private readonly prisma: PrismaService) {}

  async getSalaryGrade(salaryGradeId: string, user: RequestUser) {
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

    const salaryGrade = await this.prisma.salaryGrade.findUnique({
      where: { id: salaryGradeId, is_active: true },
    });

    if (!salaryGrade) {
      throw new NotFoundException('Salary Grade does not exist!');
    }

    return {
      status: 'success',
      message: 'Here is the Salary Grade',
      salaryGrade,
    };
  }

  async getSalaryGrades(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

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

    const whereCondition: Prisma.SalaryGradeWhereInput = {
      is_active: true,
    };

    const whereConditions: Prisma.SalaryGradeWhereInput = {};

    if (search) {
      const terms = search.split(' ');

      whereConditions.OR = terms.flatMap((term) => [
        {
          grade: { contains: term, mode: 'insensitive' },
        },
      ]);
    }

    const allowSortFields = ['created_by'];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, salaryGrades] = await this.prisma.$transaction([
      this.prisma.salaryGrade.count({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
      }),
      this.prisma.salaryGrade.findMany({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);

    // const salaryGrades = await this.prisma.salaryGrade.findMany({
    //   where: { is_active: true },
    // });

    if (salaryGrades.length === 0) {
      throw new NotFoundException('No salary grades found!');
    }

    return {
      status: 'success',
      message: 'List of Salary Grades',
      count: total,
      page,
      perPage,
      salaryGrades,
    };
  }

  async createSalaryGrade(user: RequestUser, dto: CreateSalaryGradeDto) {
    const { grade, rate, level, is_confidential } = dto;

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

    const existingGrade = await this.prisma.salaryGrade.findFirst({
      where: { grade: dto.grade },
    });

    if (existingGrade) {
      throw new ConflictException('Salary Grade already exist!');
    }

    const salaryGrade = await this.prisma.salaryGrade.create({
      data: {
        grade,
        rate,
        level,
        is_confidential,
        created_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
    const userPosition = requestUser.employee.position?.name;

    return {
      status: 'success',
      message: 'Salary Grade added successfully',
      salaryGrade,
      created_by: `${userName} - ${userPosition}`,
    };
  }

  async updateSalaryGrade(
    salaryGradeId: string,
    user: RequestUser,
    dto: UpdateSalaryGradeDto,
  ) {
    const { grade, rate, level, is_confidential } = dto;

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

    const salaryGrade = await this.prisma.salaryGrade.update({
      where: { id: salaryGradeId, is_active: true },
      data: {
        grade: grade ?? undefined,
        rate: rate ?? undefined,
        level: level ?? undefined,
        is_confidential: is_confidential ?? undefined,
        updated_by: user.id,
      },
    });

    if (!salaryGrade) {
      throw new NotFoundException('Salary Grade does not exist');
    }

    const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
    const userPosition = requestUser.employee.position?.name;

    return {
      status: 'success',
      message: 'Salary Grade updated successfully',
      salaryGrade,
      updated_by: `${userName} - ${userPosition}`,
    };
  }
}
