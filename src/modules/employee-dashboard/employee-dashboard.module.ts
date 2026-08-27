import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PerformanceEvaluationService } from './performance-evaluations/performance_evaluations.service';
import { PerformanceEvaluationController } from './performance-evaluations/performance_evaluations.controller';
import { EmployeeReportService } from './employee-report/employee-report.service';
import { EmployeeReportController } from './employee-report/employee-report.controller';

@Module({
  imports: [AuthModule],
  providers: [
    PrismaService,
    PerformanceEvaluationService,
    EmployeeReportService,
  ],
  controllers: [PerformanceEvaluationController, EmployeeReportController],
})
export class EmployeeDashboardModule {}
