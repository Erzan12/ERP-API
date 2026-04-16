import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class PerformanceEvaluationService {
    constructor (private readonly prisma: PrismaService) {}

    async getMyEvaluations(user: RequestUser) {

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: {
                employee: {
                select: {
                    id: true,
                },
                },
            },
        });

        const myEvaluations = await this.prisma.employeeEvaluation.findMany({
            where: {
                evaluator_id: requestUser?.employee?.id,
            },
        });

        return {
            myEvaluations,
        };
    }
}
