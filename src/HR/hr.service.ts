import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RequestUser } from '../Components/types/request-user.interface';

@Injectable()
export class HrService {
    constructor(private prisma: PrismaService) {}

    async getHRDashboard(user: RequestUser) {
        const totalActEmp = await this.prisma.user.count({ where: { stat: 1 }});
        const totalInActEmp = await this.prisma.user.count({ where: { stat: 0} })
        const totalSepEmp = await this.prisma.employee.count({ where: { employment_status_id: 7 }});
        const forRegEmp = await this.prisma.employee.count({ where: { employment_status_id: 1 }});

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
                overly_extended_crew_transfer: ''
            },
        };
    }
}
