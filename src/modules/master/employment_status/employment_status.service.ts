import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeStatusDto } from './dto/create-emp-stat.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { UpdateEmpStatusDto } from './dto/update-emp-stat.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class EmploymentStatusService {
  constructor(private prisma: PrismaService) {}

  //get all employee_status
  async getEmployeeStats(user: RequestUser) {
    const existingEmpStat = await this.prisma.employmentStatus.findMany();

    const employmentStatus = existingEmpStat.map((employmentStatus) => ({
      emp_stat_id: employmentStatus.id,
      code: employmentStatus.code,
      label: employmentStatus.label,
    }));

    return {
      status: 'success',
      message: 'Here are the list of Employment Status',
      employmentStatus,
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
