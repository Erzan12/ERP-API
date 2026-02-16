import { Module } from '@nestjs/common';
import { EmployeeControllerV2 } from './employee_masterlist/controllers/employeeV2.controller';
import { EmployeeService } from './employee_masterlist/employee.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV2 } from './dashboard/controllers/dashboardV2.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EmployeeService, PrismaService, DashboardService],
  controllers: [EmployeeControllerV2, DashboardControllerV2],
  exports: [HrV2Module],
})
export class HrV2Module {}
