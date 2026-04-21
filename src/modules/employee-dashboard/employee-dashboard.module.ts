import { Module } from '@nestjs/common';
import { PerformanceEvaluationController } from './performance-evaluation/performance-evaluation.controller';
import { PerformanceEvaluationService } from './performance-evaluation/performance-evaluation.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [PerformanceEvaluationController],
  providers: [PerformanceEvaluationService, PrismaService]
})
export class EmployeeDashboardModule {}
