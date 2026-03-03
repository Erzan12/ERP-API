import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeStatusDto } from './dto/create-emp-stat.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { UpdateEmpStatusDto } from './dto/update-emp-stat.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmploymentStatusService {
  constructor(private prisma: PrismaService) {}

  //get all employee_status
  async getEmployeeStats(
    user: RequestUser,
    dto: PaginationDto,
  ) {

    const { search, sortBy, order, page, perPage } = dto;

    // const existingEmpStat = await this.prisma.employmentStatus.findMany();

    const canView = await this.prisma.userRole.findFirst({
      where: {
        user_id: user.id,
        role_name: {
          in: [
            'Administrator',
            'Super Administrator',
          ],
        },
      },
    });

    if (!canView) {
      throw new ForbiddenException(
        'You are not allowed to view this sub module',
      );
    }

    //pagination area
    const skip = (page - 1) * perPage;

    const whereCondition: any = {};

    const stringFields = ['label', 'code'] as const;

    if (search) {
      const orConditions: Prisma.EmploymentStatusWhereInput[] = [];

      orConditions.push(
        ...stringFields.map((field) => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        }))
      );

      whereCondition.OR = orConditions;
    }

    const allowSortFeilds = ['id', 'created_at', 'updated_at', 'code', 'label']
    if (!allowSortFeilds.includes(sortBy)) {
      sortBy;
    }

    const [ total, employmentStats ] = await this.prisma.$transaction([
      this.prisma.employmentStatus.count({
        where: {
          ...whereCondition,
        }
      }),
      this.prisma.employmentStatus.findMany({
        where: {
          ...whereCondition,
        },
        skip,
        take: perPage,
        orderBy: {
          [sortBy]: order,
        },
      }),
    ])

    if (employmentStats.length === 0) {
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

    // const isAdmin = requestUser.user_roles.some(
    //   (role) =>
    //     // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
    //     role.role_name === 'Administrator' || 'Super Administrator',
    // );

    // if (!canView) {
    //   throw new ForbiddenException('User is not allowed to view Departments');
    // }

    // const employmentStatus = existingEmpStat.map((employmentStatus) => ({
    //   emp_stat_id: employmentStatus.id,
    //   code: employmentStatus.code,
    //   label: employmentStatus.label,
    // }));

    return {
      status: 'success',
      message: 'Here are the list of Employment Status',
      count: total,
      page,
      perPage,
      employmentStats,
    }
  }

  //get a single employee_status
  async getEmployeeStat(employeeStatusId: string, user: RequestUser) {
    const employeeStatus = await this.prisma.employmentStatus.findUnique({
      where: { id: employeeStatusId },
    });

    if (!employeeStatus) {
      throw new BadRequestException('Employee status not found.');
    }

    return {
      status: 'success',
      message: 'Here is the Employee Status',
      data: {
        employeeStatus,
      },
    };
  }

  async createEmployeeStatus(
    empStatusDto: CreateEmployeeStatusDto,
    user: RequestUser,
  ) {
    const { code, label } = empStatusDto;

    const existingEmpStat = await this.prisma.employmentStatus.findUnique({
      where: { code: empStatusDto.code },
    });

    if (existingEmpStat) {
      throw new BadRequestException('Employee Status already exist');
    }

    const createEmpStat = await this.prisma.employmentStatus.create({
      data: {
        code: empStatusDto.code,
        label: empStatusDto.label,
      },
    });

    return {
      status: 'success',
      mesage: 'Employment Status created successfully',
      data: {
        createEmpStat,
      },
    };
  }

  async updateEmployeeStatus(
    employeeStatusId: string,
    updateEmpStatusDto: UpdateEmpStatusDto,
    user: RequestUser,
  ) {
    const { code, label } = updateEmpStatusDto;

    const employment_status = await this.prisma.employmentStatus.findUnique({
      where: { id: employeeStatusId },
    });

    if (!employment_status) {
      throw new BadRequestException('Employee status does not exist.');
    }

    const updateEmployeeStatus = await this.prisma.employmentStatus.update({
      where: { id: employeeStatusId },
      data: {
        code,
        label,
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
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPosition,
      },
      updateEmployeeStatus,
    };
  }
}
