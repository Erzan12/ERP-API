import { Module } from '@nestjs/common';
import { EmployeeControllerV1 } from './employee_masterlist/controllers/employeeV1.controller';
import { EmployeeService } from './employee_masterlist/employee.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV1 } from './dashboard/controllers/dashboardV1.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { CareerPostingController } from './career_posting/career_posting.controller';
import { CareerPostingV2Controller } from './career_posting-v2/career_posting-v2.controller';
import { CareerPostingService } from './career-posting/career-posting.service';

@Module({
  imports: [AuthModule],
  providers: [EmployeeService, PrismaService, DashboardService, CareerPostingService],
  controllers: [EmployeeControllerV1, DashboardControllerV1, CareerPostingController, CareerPostingV2Controller],
  exports: [HrV1Module],
})
export class HrV1Module {}
