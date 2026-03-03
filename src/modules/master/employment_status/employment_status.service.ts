import { BadRequestException, Injectable } from '@nestjs/common';
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
  async getEmployeeStat(id: string, user: RequestUser) {
    const employeeStatus = await this.prisma.employmentStatus.findUnique({
      where: { id },
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
    id: string,
    updateEmpStatusDto: UpdateEmpStatusDto,
    user: RequestUser,
  ) {
    const { code, label } = updateEmpStatusDto;

    const employment_status = await this.prisma.employmentStatus.findUnique({
      where: { id },
    });

    if (!employment_status) {
      throw new BadRequestException('Employee status does not exist.');
    }

    const updateEmpStat = await this.prisma.employmentStatus.update({
      where: { id },
      data: {
        code,
        label,
      },
    });

    return {
      status: 'success',
      message: 'Employment Status updated successfully.',
      data: {
        updateEmpStat,
      },
    };
  }
}
