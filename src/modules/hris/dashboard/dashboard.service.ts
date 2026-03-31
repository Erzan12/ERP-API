import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getHRDashboard() {
    const totalActEmp = await this.prisma.user.count({
      where: { is_active: true },
    });
    const totalInActEmp = await this.prisma.user.count({
      where: { is_active: false },
    });
    const totalSepEmp = await this.prisma.employee.count({
      where: {
        employment_status: {
          code: {
            in: ['RESIGNED', 'TERMINATED'],
          },
        },
      },
    });
    const forRegEmp = await this.prisma.employee.count({
      where: {
        employment_status: {
          code: {
            in: ['REGULAR'],
          },
        },
      },
    });

    // for awol

    //for overly extended crew transfer

    return {
      status: 'success',
      message: 'Welcome to Human Resources Dashboard',
      data: {
        total_active_employees: totalActEmp,
        total_inactive_employees: totalInActEmp,
        total_separated_employees: totalSepEmp,
        for_regularization_employee: forRegEmp,
        employees_due_for_awol: '',
        overly_extended_crew_transfer: '',
      },
    };
  }
}
