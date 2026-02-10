import { Injectable } from '@nestjs/common';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getHRDashboard(user: RequestUser) {
    const totalActEmp = await this.prisma.user.count({ where: { stat: 1 } });
    const totalInActEmp = await this.prisma.user.count({ where: { stat: 0 } });
    const totalSepEmp = await this.prisma.employee.count({
      where: { employment_status_id: {
          in: [
            "75bea098-1322-47a7-9a15-1657d8931126",
            "3fb69883-6838-4ff9-abfa-18ec3628cf71",
          ]
        }
      },
    });
    const forRegEmp = await this.prisma.employee.count({
      where: { employment_status_id: "fbd0dc31-2fc4-4ced-952f-39eaec30477c" },
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
