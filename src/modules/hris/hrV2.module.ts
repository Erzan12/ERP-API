import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

import { EmployeeMasterlistService } from './employee/employee_masterlist/employee.service';
import {
  EmployeeMasterlistController,
  EmploymentHistoryController,
} from './employee/employee_masterlist/employee.controller';

import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV2 } from './dashboard/dashboardV2.controller';

import { AuthModule } from 'src/auth/auth.module';
import { AdministratorModule } from '../administrator/administrator.module';

import { CareerPostingService } from './recruitment-and-onboarding/career-posting/career-posting.service';
import { CareerPostingV2Controller } from './recruitment-and-onboarding/career-posting/career-posting-v2.controller';

import {
  HiringPipelineService,
  InterviewApplicantService,
  ScreeningApplicantService,
} from './recruitment-and-onboarding/hiring-pipeline/hiring-pipeline.service';
import {
  ApplicantsController,
  InterviewApplicantController,
  ScreeningApplicantController,
} from './recruitment-and-onboarding/hiring-pipeline/hiring-pipelineV2.controller';
import { RegularizationReviewsService } from './performance-management/regularization-reviews/regularization-reviews.service';
import { RegularizationReviewsController } from './performance-management/regularization-reviews/regularization-reviews.controller';
import { PerformanceCompetencyController } from './performance-management/performance-competency/performance-competency.controller';
import { PerformanceCompetencyService } from './performance-management/performance-competency/performance-competency.service';
import { LeaveCategoryController } from './time-and-attendance-cases/leave-category/leave-category.controller';
import { LeaveCategoryService } from './time-and-attendance-cases/leave-category/leave-category.service';
import { LeaveCasesService } from './time-and-attendance-cases/leave-cases/leave-cases.service';
import { LeaveCasesController } from './time-and-attendance-cases/leave-cases/leave-cases.controller';
import { AttachmentUploadService } from 'src/jobs/attachment-upload/attachment-upload.service';
import { ExtendedLeaveCasesService } from './time-and-attendance-cases/extended-leave-cases/extended-leave-cases.service';
import { ExtendedLeaveCasesController } from './time-and-attendance-cases/extended-leave-cases/extended-leave-cases.controller';
import { OvertimeRateService } from './time-and-attendance-cases/overtime-rate/overtime-rate.service';
import { OvertimeRateController } from './time-and-attendance-cases/overtime-rate/overtime-rate.controller';
import { OvertimeCasesService } from './time-and-attendance-cases/overtime-cases/overtime-cases.service';
import { OvertimeCasesController } from './time-and-attendance-cases/overtime-cases/overtime-cases.controller';
import { SalaryGradeService } from './salary-grade/salary-grade.service';
import { SalaryGradeController } from './salary-grade/salary-grade.controller';

@Module({
  imports: [AuthModule, AdministratorModule],
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
    ExtendedLeaveCasesService,
    OvertimeRateService,
    OvertimeCasesService,
    SalaryGradeService,
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
    ExtendedLeaveCasesController,
    OvertimeRateController,
    OvertimeCasesController,
    SalaryGradeController,
  ],
  exports: [HrV2Module],
})
export class HrV2Module {}
