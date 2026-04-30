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
} from './recruitment_and_onboarding/hiring-pipeline/hiring-pipeline.service';
import {
  ApplicantsController,
  InterviewApplicantController,
} from './recruitment_and_onboarding/hiring-pipeline/hiring-pipelineV2.controller';
import { RegularizationReviewsService } from './performance_management/regularization_reviews/regularization_reviews.service';
import { RegularizationReviewsController } from './performance_management/regularization_reviews/regularization_reviews.controller';
import { PerformanceCompetencyController } from './performance_management/performance_competency/performance_competency.controller';
import { PerformanceCompetencyService } from './performance_management/performance_competency/performance_competency.service';
import { LeaveCategoryController } from './time_and_attendance_cases/leave_category/leave_category.controller';
import { LeaveCategoryService } from './time_and_attendance_cases/leave_category/leave_category.service';
import { LeaveCasesService } from './time_and_attendance_cases/leave_cases/leave_cases.service';
import { LeaveCasesController } from './time_and_attendance_cases/leave_cases/leave_cases.controller';
import { AttachmentUploadService } from 'src/jobs/attachment-upload/attachment-upload.service';

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
    AttachmentUploadService
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
    LeaveCategoryController,
    LeaveCasesController,
  ],
  exports: [HrV2Module],
})
export class HrV2Module {}
