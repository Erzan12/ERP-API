import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { HrErCasePartyRole, HrErCaseStage, Prisma } from '@prisma/client';
import { SubmitDecisionDto } from './dto/submit-decision.dto';

@Injectable()
export class NoticeOfDecisionService {
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

    private async assertRespondentAtStage(
        tx: Prisma.TransactionClient,
        caseId: string,
        partyId: string,
        expectedStage: HrErCaseStage,
    ) {
        const party = await tx.hrErCaseParty.findUniqueOrThrow({
            where: { id: partyId },
        });

        if (party.case_id !== caseId) {
            throw new BadRequestException('Party does not belong to this case.');
        }

        if (party.role !== HrErCasePartyRole.respondent) {
            throw new BadRequestException('Only respondents apply here.');
        }

        if (party.stage !== expectedStage) {
            throw new BadRequestException(
                `Party is at stage "${party.stage}", not ${expectedStage}.`,
            );
        }

        return party;
    }

    async submitNoticeOfDecision(
        dto: SubmitDecisionDto,
        user: RequestUser,
    ) {
        await this.assertHrAccess(user.id);

        return this.prisma.$transaction(async (tx) => {
            await this.assertRespondentAtStage(tx, dto.disciplinary_case_id, dto.party_id, HrErCaseStage.notice_of_decision);

            const existing = await tx.hrErCaseDecision.findUnique({ 
                where: { party_id: dto.party_id },
            })

            if (existing?.issued_at) {
                throw new ConflictException('A decisioin has already been issued for this respondent.');
            }

            if (dto.effectivity_start && dto.effectivity_end) {
                const start = new Date(dto.effectivity_start);
                const end = new Date(dto.effectivity_end);
                if (start >= end){
                    throw new BadRequestException('Effectivity end must be later than the start date.');
                }
            }

            const decision = await tx.hrErCaseDecision.upsert({
                where: { party_id: dto.party_id },
                create: {
                    party_id: dto.party_id,
                    decision_type: dto.decision_type,
                    effectivity_start: dto.effectivity_start ? new Date(dto.effectivity_start) : null,
                    effectivity_end: dto.effectivity_end ? new Date(dto.effectivity_end) : null,
                    signed_file_url: dto.signed_file_url,
                    remarks: dto.remarks,
                    issued_at: new Date(),
                    created_by: user.id
                },
                update: {   
                    decision_type: dto.decision_type,
                    effectivity_start: dto.effectivity_start ? new Date(dto.effectivity_start) : null,
                    effectivity_end: dto.effectivity_end ? new Date(dto.effectivity_end) : null,
                    signed_file_url: dto.signed_file_url,
                    remarks: dto.remarks,
                    issued_at: new Date(),
                    created_by: user.id
                },
            });

            await tx.hrErCaseActivityLog.create({
                data: {
                    case_id: dto.disciplinary_case_id,
                    party_id: dto.party_id,
                    actor_id: user.id,
                    action: 'notice_of_decision_served',
                },
            });

            return {
                status: 'success',
                message: 'Notice of Decision served',
                decision,
            };
        });
    }
}
