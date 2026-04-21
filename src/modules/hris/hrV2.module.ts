import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

import { EmployeeService } from './employee/employee_masterlist/employee.service';
import { EmployeeControllerV2 } from './employee/employee_masterlist/employee.controller';

import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV2 } from './dashboard/dashboardV2.controller';

import { AuthModule } from 'src/auth/auth.module';
import { AdministratorV2Module } from '../administrator/administratorV2.module';

import { CareerPostingService } from './career-posting/career-posting.service';
import { CareerPostingV2Controller } from './career-posting/career-posting-v2.controller';

import {
  HiringPipelineService,
  InterviewApplicantService,
} from './hiring-pipeline/hiring-pipeline.service';
import {
  ApplicantsController,
  InterviewApplicantController,
} from './hiring-pipeline/hiring-pipelineV2.controller';

@Module({
  imports: [AuthModule, AdministratorV2Module],
  providers: [
    EmployeeService,
    PrismaService,
    DashboardService,
    CareerPostingService,
    HiringPipelineService,
    InterviewApplicantService,
    // ScreeningApplicantService,
  ],
  controllers: [
    EmployeeControllerV2,
    DashboardControllerV2,
    CareerPostingV2Controller,
    ApplicantsController,
    // ScreeningApplicantController,
    InterviewApplicantController,
  ],
  exports: [HrV2Module],
})
export class HrV2Module {}
