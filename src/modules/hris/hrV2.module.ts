import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

import { EmployeeMasterlistService } from './employee/employee_masterlist/employee.service';
import { EmployeeMasterlistController, EmploymentHistoryController } from './employee/employee_masterlist/employee.controller';

import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV2 } from './dashboard/dashboardV2.controller';

import { AuthModule } from 'src/auth/auth.module';
import { AdministratorV2Module } from '../administrator/administratorV2.module';

import { CareerPostingService } from './recruitment_and_onboarding/career-posting/career-posting.service';
import { CareerPostingV2Controller } from './recruitment_and_onboarding/career-posting/career-posting-v2.controller';

import {
  HiringPipelineService,
  InterviewApplicantService,
  ScreeningApplicantService,
} from './recruitment_and_onboarding/hiring-pipeline/hiring-pipeline.service';
import {
  ApplicantsController,
  InterviewApplicantController,
  ScreeningApplicantController,
} from './recruitment_and_onboarding/hiring-pipeline/hiring-pipelineV2.controller';
import { RegularizationReviewsService } from './performance_management/regularization_reviews/regularization_reviews.service';
import { RegularizationReviewsController } from './performance_management/regularization_reviews/regularization_reviews.controller';
import { PerformanceCompetencyController } from './performance_management/performance_competency/performance_competency.controller';
import { PerformanceCompetencyService } from './performance_management/performance_competency/performance_competency.service';
import { LeaveCategoryController } from './time-and-attendance-cases/leave-category/leave-category.controller';
import { LeaveCategoryService } from './time-and-attendance-cases/leave-category/leave-category.service';
import { LeaveCasesService } from './time-and-attendance-cases/leave-cases/leave-cases.service';
import { LeaveCasesController } from './time-and-attendance-cases/leave-cases/leave-cases.controller';
import { AttachmentUploadService } from 'src/jobs/attachment-upload/attachment-upload.service';
import { ExtendedLeaveCasesService } from './time-and-attendance-cases/extended-leave-cases/extended-leave-cases.service';
import { ExtendedLeaveCasesController } from './time-and-attendance-cases/extended-leave-cases/extended-leave-cases.controller';

@Module({
  imports: [AuthModule, AdministratorV2Module],
  providers: [
    EmployeeMasterlistService,
    PrismaService,
    DashboardService,
    CareerPostingService,
    HiringPipelineService,
    InterviewApplicantService,
    RegularizationReviewsService,
    PerformanceCompetencyService,
    LeaveCategoryService,
    LeaveCasesService,
    AttachmentUploadService,
    ScreeningApplicantService,
    ExtendedLeaveCasesService
    // ScreeningApplicantService,
  ],
  controllers: [
    EmployeeMasterlistController,
    EmploymentHistoryController,
    DashboardControllerV2,
    CareerPostingV2Controller,
    ApplicantsController,
    // ScreeningApplicantController,
    InterviewApplicantController,
    RegularizationReviewsController,
    PerformanceCompetencyController,
    ScreeningApplicantController,
    LeaveCategoryController,
    LeaveCasesController,
    ExtendedLeaveCasesController
  ],
  exports: [HrV2Module],
})
export class HrV2Module {}
