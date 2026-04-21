import { Module } from '@nestjs/common';
import { PerformanceEvaluationController } from './performance-evaluation/performance-evaluation.controller';
import { PerformanceEvaluationService } from './performance-evaluation/performance-evaluation.service';

@Module({
  controllers: [PerformanceEvaluationController],
  providers: [PerformanceEvaluationService]
})
export class EmployeeDashboardModule {}
