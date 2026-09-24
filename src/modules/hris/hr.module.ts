import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

import { EmployeeService } from './employee/employee-masterlist/employee.service';
import { EmployeeController } from './employee/employee-masterlist/employee.controller';

import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';

import { AuthModule } from 'src/auth/auth.module';
import { AdministratorModule } from '../administrator/administrator.module';

import { CareerPostingService } from './recruitment-and-onboarding/career-posting/career-posting.service';
import { CareerPostingController } from './recruitment-and-onboarding/career-posting/career-posting.controller';

import {
  HiringPipelineService,
  InterviewApplicantService,
} from './recruitment-and-onboarding/hiring-pipeline/hiring-pipeline.service';
import {
  ApplicantsController,
  InterviewApplicantController,
} from './recruitment-and-onboarding/hiring-pipeline/hiring-pipeline.controller';
import { RegularizationReviewsService } from './performance-management/regularization-reviews/regularization-reviews.service';
import { RegularizationReviewsController } from './performance-management/regularization-reviews/regularization-reviews.controller';
import { PerformanceCompetencyService } from './performance-management/performance-competency/performance-competency.service';
import { PerformanceCompetencyController } from './performance-management/performance-competency/performance-competency.controller';
import { LeaveCasesService } from './time-and-attendance-cases/leave-cases/leave-cases.service';
import { LeaveCategoryService } from './time-and-attendance-cases/leave-category/leave-category.service';
import { LeaveCasesController } from './time-and-attendance-cases/leave-cases/leave-cases.controller';
import { LeaveCategoryController } from './time-and-attendance-cases/leave-category/leave-category.controller';

@Module({
  imports: [AuthModule, AdministratorModule],
  providers: [
    EmployeeService,
    PrismaService,
    DashboardService,
    CareerPostingService,
    HiringPipelineService,
    InterviewApplicantService,
    RegularizationReviewsService,
    PerformanceCompetencyService,
    LeaveCasesService,
    LeaveCategoryService,
    // ScreeningApplicantService,
  ],
  controllers: [
    EmployeeController,
    DashboardController,
    CareerPostingController,
    ApplicantsController,
    // ScreeningApplicantController,
    InterviewApplicantController,
    RegularizationReviewsController,
    PerformanceCompetencyController,
    LeaveCasesController,
    LeaveCategoryController,
  ],
  exports: [HrModule],
})
export class HrModule {}
