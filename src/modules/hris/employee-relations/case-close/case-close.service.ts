import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class CaseCloseService {
    constructor (private readonly prisma: PrismaService) {} 

    // Helper for auth check
    private async assertHrAccess(userId: string) {
        const requestUser = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                employee: { include: { person: true, position: true } },
                user_roles: true,
            },
        });

        if (!requestUser?.employee?.person) {
            throw new BadRequestException('User does not exist.');
        }

        const allowedRoles = [
            'Administrator',
            'Super Administrator',
            'HR Administrator',
            'HR Manager',
            'HR Clerk',
            'HR Staff',
        ];
        const canView = requestUser.user_roles.some((role) =>
            allowedRoles.includes(role.role_name),
        );

        if (!canView) {
            throw new ForbiddenException(
                'You are not authorized to perform this action',
            );
        }

        return requestUser;
    }

    async closeCase(disciplinaryCaseId: string, user: RequestUser) {
        await this.assertHrAccess(user.id);

        return this.prisma.$transaction(async (tx) => {
            const disciplinaryCase = await tx.hrErCase.findUnique({
                where: { id: disciplinaryCaseId },
                include: {
                    parties: {
                        where: {
                            role: 'respondent',
                        },
                        select: {
                            id: true,
                            stage: true,
                        },
                    },
                },
            });

            if (!disciplinaryCase) {
                throw new NotFoundException('Disciplinary case not found.');
            }

            if (disciplinaryCase.status === 'closed') {
                return {
                    status: 'success',
                    message: 'Case is already closed',
                };
            }

            const now = new Date();

            // Close the current case_closed stage for every respondent
            await tx.hrErCaseStageLog.updateMany({
                where: {
                    party_id: {
                        in: disciplinaryCase.parties.map((party) => party.id),
                    },
                    stage: 'case_closed',
                    exited_at: null,
                },
                data: {
                    exited_at: now,
                },
            });

            // Close the case itself
            await tx.hrErCase.update({
                where: {
                    id: disciplinaryCaseId,
                },
                data: {
                    status: 'closed',
                    stage: 'case_closed',
                    closed_at: now,
                    updated_by: user.id,
                },
            });

            await tx.hrErCaseActivityLog.create({
                data: {
                    case_id: disciplinaryCaseId,
                    actor_id: user.id,
                    action: 'case_closed',
                },
            });

            return {
                status: 'success',
                message: 'Case is now closed.',
            };
        });
    }
}
