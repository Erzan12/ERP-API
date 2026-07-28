import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  CreateOvertimeRateDto,
  UpdateOvertimeRateDto,
} from './dto/overtime-rate.dto';
import { OvertimeRequestsPaginationDto } from 'src/utils/dtos/overtime-request-pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OvertimeRateService {
  constructor(private prisma: PrismaService) {}

  async getOvertimeRates(user: RequestUser, dto: OvertimeRequestsPaginationDto) {
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

    const whereCondition: Prisma.HrOvertimeRateWhereInput = {
      is_active: true,
    };

    const whereConditions: Prisma.HrOvertimeRateWhereInput = {};

    if (search) {
      const terms = search.split(' ');

      whereConditions.OR = terms.flatMap((term) => [
        {
          type: { contains: term, mode: 'insensitive' },
        },
      ]);
    }

    const allowSortFields = ['created_by'];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, overtimeRates] = await this.prisma.$transaction([
      this.prisma.hrOvertimeRate.count({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
      }),
      this.prisma.hrOvertimeRate.findMany({
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

    if (overtimeRates.length === 0) {
      throw new NotFoundException('No overtime rate is available');
    }

    return {
      status: 'success',
      message: 'List of Overtime Rate',
      count: total,
      page,
      perPage,
      overtimeRates,
    };
  }

  async getOvertimeRate(user: RequestUser, overtimeRateId: string) {
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

    const overtimeRate = await this.prisma.hrOvertimeRate.findUnique({
      where: { id: overtimeRateId, is_active: true },
    });

    if (!overtimeRate || overtimeRate.is_active === false) {
      throw new BadRequestException('Overtime rate not found or is inactive');
    }

    return {
      status: 'success',
      message: 'Here is the overtime rate',
      overtimeRate,
    };
  }

  async createOvertimeRate(user: RequestUser, dto: CreateOvertimeRateDto) {
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

    const overtimeRate = await this.prisma.hrOvertimeRate.create({
      data: {
        type: dto.type,
        rate: dto.rate,
        created_by: user.id,
      },
      include: {
        overtimeRequests: true,
      },
    });

    const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
    const userPosition = requestUser.employee.position?.name;

    return {
      status: 'success',
      message: 'Overtime Rate created successfully',
      overtimeRate,
      created_by: `${userName} - ${userPosition}`,
    };
  }

  async updateOvertimeRate(
    user: RequestUser,
    dto: UpdateOvertimeRateDto,
    overtimeRateId: string,
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

    const overtimeRate = await this.prisma.hrOvertimeRate.update({
      where: { id: overtimeRateId, is_active: true },
      data: {
        type: dto.type ?? undefined,
        rate: dto.rate ?? undefined,
        is_active: dto.is_active ?? undefined,
        updated_by: user.id,
      },
      include: {
        overtimeRequests: true,
      },
    });

    const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
    const userPosition = requestUser.employee.position?.name;

    return {
      status: 'success',
      message: 'Overtime rate updated successfully',
      overtimeRate,
      updated_by: `${userName} - ${userPosition}`,
    };
  }
}
