import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PerformanceEvaluationService } from './performance_evaluations.service';
import { PerformanceEvaluationController } from './performance_evaluations.controller';

@Module({
    imports: [AuthModule],
    providers: [
        PrismaService,
        PerformanceEvaluationService
    ],
    controllers: [
        PerformanceEvaluationController
    ]
})
export class PerformanceEvaluationModule {}
