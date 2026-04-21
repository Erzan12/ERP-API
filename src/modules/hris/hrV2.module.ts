import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

import { EmployeeService } from './employee/employee-masterlist/employee.service';
import { EmployeeControllerV2 } from './employee/employee-masterlist/employee.controller';

import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV2 } from './dashboard/dashboardV2.controller';

import { AuthModule } from 'src/auth/auth.module';
import { AdministratorV2Module } from '../administrator/administratorV2.module';

import { CareerPostingService } from './recruitment_and_onboarding/career-posting/career-posting.service';
import { CareerPostingV2Controller } from './recruitment_and_onboarding/career-posting/career-posting-v2.controller';

import {
  HiringPipelineService,
  InterviewApplicantService,
} from './recruitment_and_onboarding/hiring-pipeline/hiring-pipeline.service';
import {
  ApplicantsController,
  InterviewApplicantController,
} from './recruitment_and_onboarding/hiring-pipeline/hiring-pipelineV2.controller';
import { RegularizationReviewsService } from './performance-management/regularization-reviews/regularization-reviews.service';
import { RegularizationReviewsController } from './performance-management/regularization-reviews/regularization-reviews.controller';

@Module({
  imports: [AuthModule, AdministratorV2Module],
  providers: [
    EmployeeService,
    PrismaService,
    DashboardService,
    CareerPostingService,
    HiringPipelineService,
    InterviewApplicantService,
    RegularizationReviewsService
    // ScreeningApplicantService,
  ],
  controllers: [
    EmployeeControllerV2,
    DashboardControllerV2,
    CareerPostingV2Controller,
    ApplicantsController,
    // ScreeningApplicantController,
    InterviewApplicantController,
    RegularizationReviewsController
  ],
  exports: [HrV2Module],
})
export class HrV2Module {}
