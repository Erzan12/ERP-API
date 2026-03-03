import { Module } from '@nestjs/common';
import { EmployeeControllerV1 } from './employee_masterlist/controllers/employeeV1.controller';
import { EmployeeService } from './employee_masterlist/employee.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV1 } from './dashboard/controllers/dashboardV1.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EmployeeService, PrismaService, DashboardService],
  controllers: [EmployeeControllerV1, DashboardControllerV1],
  exports: [HrV1Module],
})
export class HrV1Module {}
