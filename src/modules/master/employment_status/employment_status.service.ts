import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateEmployeeStatusDto,
  UpdateEmployeeStatusDto,
} from './dto/employee-status.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmploymentStatusService {
  constructor(private prisma: PrismaService) {}

  //get all employee_status
  async getEmployeeStats(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    //pagination area
    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.EmploymentStatusWhereInput = {};

    const stringFields = ['label', 'code'] as const;

    if (search) {
      const orConditions: Prisma.EmploymentStatusWhereInput[] = [];

      orConditions.push(
        ...stringFields.map((field) => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      );

      whereCondition.OR = orConditions;
    }

    const allowSortFeilds = ['id', 'created_at', 'updated_at', 'code', 'label'];
    // if (!allowSortFeilds.includes(sortBy)) {
    //   sortBy;
    // }
    const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';

    const [total, employmentStatus] = await this.prisma.$transaction([
      this.prisma.employmentStatus.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.employmentStatus.findMany({
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

    // if (employmentStats.length === 0) {
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
      message: 'Here are the list of Employment Status',
      count: total,
      page,
      perPage,
      employmentStatus,
    };
  }

  //get a single employee_status
  async getEmployeeStat(employeeStatusId: string, user: RequestUser) {
    const employeeStat = await this.prisma.employmentStatus.findUnique({
      where: { id: employeeStatusId },
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

    if (!employeeStat) {
      throw new BadRequestException('Employee status not found.');
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
      message: 'Here is the Employee Status',
      employeeStat,
    };
  }

  async createEmployeeStatus(
    empStatusDto: CreateEmployeeStatusDto,
    user: RequestUser,
  ) {
    const existingEmpStat = await this.prisma.employmentStatus.findUnique({
      where: { code: empStatusDto.code },
    });

    if (existingEmpStat) {
      throw new BadRequestException('Employee Status already exist');
    }

    const employeeStatus = await this.prisma.employmentStatus.create({
      data: {
        code: empStatusDto.code,
        label: empStatusDto.label,
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

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      mesage: 'Employment Status created successfully',
      employeeStatus,
      created_by_user: `${userName} - ${userPosition}`,
    };
  }

  async updateEmployeeStatus(
    employeeStatusId: string,
    updateEmployeeStatusDto: UpdateEmployeeStatusDto,
    user: RequestUser,
  ) {
    const employment_status = await this.prisma.employmentStatus.findUnique({
      where: { id: employeeStatusId },
    });

    if (!employment_status) {
      throw new BadRequestException('Employee status does not exist.');
    }

    const updatedEmployeeStatus = await this.prisma.employmentStatus.update({
      where: { id: employeeStatusId },
      data: {
        code: updateEmployeeStatusDto.code ?? undefined,
        label: updateEmployeeStatusDto.label ?? undefined,
        updatedBy: {
          connect: { id: user.id },
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
        user_roles: true,
      },
    });

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new NotFoundException('User does not exist');
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    const isAdmin = requestUser.user_roles.some(
      (role) =>
        // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
        role.role_name === 'Administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'User is not allowed to update User Location.',
      );
    }

    return {
      status: 'success',
      message: 'Employment Status updated successfully.',
      // {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPosition,
      // },
      updatedEmployeeStatus,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }
}
