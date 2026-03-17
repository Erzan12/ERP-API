import { Module } from '@nestjs/common';
import { EmployeeControllerV1 } from './employee_masterlist/controllers/employeeV1.controller';
import { EmployeeService } from './employee_masterlist/employee.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV1 } from './dashboard/controllers/dashboardV1.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { CareerPostingService } from './career-posting/career-posting.service';
import { CareerPostingV1Controller } from './career-posting/controllers/career-posting-v1.controller';
import { HiringPipelineV1Controller } from './hiring-pipeline/controller/hiring-pipelineV1.controller';
import { HiringPipelineService } from './hiring-pipeline/hiring-pipeline.service';

@Module({
  imports: [AuthModule],
  providers: [EmployeeService, PrismaService, DashboardService, CareerPostingService, HiringPipelineService],
  controllers: [EmployeeControllerV1, DashboardControllerV1, CareerPostingV1Controller, HiringPipelineV1Controller],
  exports: [HrV1Module],
})
export class HrV1Module {}
