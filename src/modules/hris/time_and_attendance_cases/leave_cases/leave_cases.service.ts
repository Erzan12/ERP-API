import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class LeaveCasesService {
    constructor (private readonly prisma: PrismaService) {}

    async getLeaveCases(user: RequestUser) {
        const leaves = await this.prisma.hrLeaveRequest.findMany()

        if (leaves.length === 0) {
            throw new NotFoundException('No Leave Cases found')
        }

        return {
            status: 'success',
            message: 'List of Leave Cases',
            leaves
        }
    }
}
