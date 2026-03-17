import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

import { EmployeeControllerV2 } from './employee_masterlist/controllers/employeeV2.controller';
import { EmployeeService } from './employee_masterlist/employee.service';

import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV2 } from './dashboard/controllers/dashboardV2.controller';

import { AuthModule } from 'src/auth/auth.module';
import { AdministratorV2Module } from '../administrator/administratorV2.module';

import { CareerPostingService } from './career-posting/career-posting.service';
import { CareerPostingV2Controller } from './career-posting/controllers/career-posting-v2.controller';

import { HiringPipelineService } from './hiring-pipeline/hiring-pipeline.service';
import { HiringPipelineV2Controller } from './hiring-pipeline/controller/hiring-pipelineV2.controller';

@Module({
  imports: [AuthModule, AdministratorV2Module],
  providers: [EmployeeService, PrismaService, DashboardService, CareerPostingService, HiringPipelineService],
  controllers: [EmployeeControllerV2, DashboardControllerV2, CareerPostingV2Controller, HiringPipelineV2Controller],
  exports: [HrV2Module],
})
export class HrV2Module {}
