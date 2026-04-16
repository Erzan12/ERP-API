import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { EvaluatorService } from './evaluator.service';
import { EvaluatorController } from './evaluator.controller';

@Module({
    imports: [AuthModule],
    providers: [
        PrismaService,
        EvaluatorService
    ],
    controllers: [
        EvaluatorController
    ]
})
export class EvaluatorModule {}
