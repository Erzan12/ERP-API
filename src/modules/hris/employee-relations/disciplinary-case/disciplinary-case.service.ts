import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { HrErCaseLevel, HrErCasePartyRole, HrErCaseStage, HrErExplanationStatus, HrErHearingStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ControlNumberService } from 'src/jobs/control-number/control-number.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateCaseDto, getStageTiming } from './dto/create-case.dto';
import { SLA_DAYS, STAGE_ORDER } from './constants/hr-er-constants';

type Eligibility = { eligible: boolean; reason?: string };


@Injectable()
export class DisciplinaryCaseService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly controlNumberService: ControlNumberService,
    ) {}

    // Helper for auth check
    private async assertHrAccess(userId: string) {
        const requestUser = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { employee: { include: { person: true, position: true } }, user_roles: true },
        });

        if (!requestUser?.employee?.person) {
            throw new BadRequestException('User does not exist.');
        }

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser.user_roles.some((role) => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        return requestUser;
    }

    private checkPartyEligibility(
        party: Prisma.HrErCasePartyGetPayload<{
            include: {
                nte: true;
                explanation: true;
                hearings: true;
                decision: true;
            };
        }>,
    ): Eligibility {
        switch (party.stage) {
            case HrErCaseStage.notice_to_explain :
                return party.nte?.issued_at
                    ? { eligible: true }
                    : { eligible: false, reason: 'NTE not yet issued/served.' };

            case HrErCaseStage.written_explanation : {
                const status = party.explanation?.status;

                return status === 'received' || status === 'no_response'
                    ? { eligible: true }
                    : { eligible: false, reason: 'Still awaiting written explanation.' };
                }
            case HrErCaseStage.administrative_hearing : {
                const latest = party.hearings.at(-1); // most recent by created_at
                    return latest && ['conducted', 'no_show'].includes(latest.status)
                        ? { eligible: true }
                        : { eligible: false, reason: 'Hearing not yet conducted.' };
                }

            case HrErCaseStage.notice_of_decision :
                return party.decision?.issued_at
                    ? { eligible: true }
                    : { eligible: false, reason: 'Decision not yet issued.' };

                default:
                return { eligible: false, reason: 'Already at final stage.' };
        }
    }

    private async recomputeCaseRollup(tx: Prisma.TransactionClient, caseId: string) {
        const respondents = await tx.hrErCaseParty.findMany({
            where: { case_id: caseId, role: 'respondent' },
            select: { stage: true },
        });
        // const active = respondents.filter(r => r.stage !== 'case_closed');
        const active = respondents.filter(
            (r): r is { stage: HrErCaseStage } => r.stage !== null && r.stage !== 'case_closed',
        );
        const allClosed = active.length === 0;

        const STAGE_ORDER: HrErCaseStage[] = [
            HrErCaseStage.notice_to_explain,
            HrErCaseStage.written_explanation,
            HrErCaseStage.administrative_hearing,
            HrErCaseStage.notice_of_decision,
            HrErCaseStage.case_closed,
        ];

        const rollupStage = allClosed
            ? 'case_closed'
            : active.reduce((min, r) => STAGE_ORDER.indexOf(r.stage) < STAGE_ORDER.indexOf(min) ? r.stage : min, active[0].stage);
            
        await tx.hrErCase.update({
            where: { id: caseId },
            data: {
                stage: rollupStage,
                ...(allClosed ? { status: 'closed', closed_at: new Date() } : {}),
            },
        });
    }

    async generate(
        companyId: string,
        companyAbbreviation: string,
        db?: Prisma.TransactionClient,
    ) {
        const year = new Date().getFullYear();

        const controlNumber =
        await this.controlNumberService.getNextNumber(
            companyId,
            'HR_ER_CASE',
            year,
            db,
        );

        const caseCode =
            `ER-${companyAbbreviation}-${year}-${String(controlNumber).padStart(4, '0')}`;

        return {
            controlNumber,
            caseCode,
        };
    }

    async getDisciplinaryCases(user: RequestUser) {
        await this.assertHrAccess(user.id);

        const disciplinaryCases = await this.prisma.hrErCase.findMany({
            include: {
                intake: true,
                parties: {
                    include: {
                        stage_logs: true,
                        offenses: true,
                        violations: true,
                        actions: true,
                    },
                },
                attachments: true,
            },
        });

        if (disciplinaryCases.length === 0) {
            throw new NotFoundException('No displicary cases found.');
        }

        return {
            status: 'success',
            message: 'List of Disciplinary Cases',
            disciplinaryCases,
        };
    }

    async getDisciplinaryCase(disciplinaryCaseId: string, user: RequestUser) {
        await this.assertHrAccess(user.id);

        const disciplinaryCase = await this.prisma.hrErCase.findUnique({
            where: { id: disciplinaryCaseId, },
            include: {
                intake: true,
                parties: {
                    include: {
                        stage_logs: true,
                        offenses: true,
                        violations: true,
                        actions: true,
                    },
                },
                attachments: true,
            },
        });

        if (!disciplinaryCase) {
            throw new NotFoundException('Disciplinary Case not found.');
        }

        return {
            status: 'success',
            message: 'Here is the Disciplinary Case',
            disciplinaryCase,
        };
    }

    // To view the status of the Case e.g "10 days Overdue"
    async getCaseDetail(caseId: string, user: RequestUser) {
        await this.assertHrAccess(user.id);

        const kase = await this.prisma.hrErCase.findUniqueOrThrow({
            where: { id: caseId },
            include: {
                parties: { 
                    include: {
                        nte: true,
                        explanation: true,
                        hearings: true,
                        decision: true,
                        stage_logs: true,
                        // offenses: true,
                        // violations: true,
                        // actions: true,
                    },
                },
            },
        });

        const partiesWithTiming = kase.parties.map((party) => ({
            ...party,
            timing: party.stage
                ? getStageTiming(party, SLA_DAYS[party.stage])
                : null,
        }));

        return { ...kase, parties: partiesWithTiming };
    }

    async createCase(dto: CreateCaseDto, user: RequestUser) {
        await this.assertHrAccess(user.id);

        // Validate business rules before starting the transaction
        for (const p of dto.parties) {
            if (p.action) {

                // Preventive suspension is respondent + major only
                if (
                    p.role !== HrErCasePartyRole.respondent ||
                    p.level !== HrErCaseLevel.major
                ) {
                    throw new BadRequestException(
                        'Preventive suspension is only available for major respondents.',
                    );
                }

                // Validate suspension date range
                const start = new Date(p.action.effectivity_start);
                const end = new Date(p.action.effectivity_end);

                if (start >= end) {
                    throw new BadRequestException(
                        'Preventive suspension effectivity end must be later than the start date.',
                    );
                }
            }
        }

        return this.prisma.$transaction(async (tx) => {
            const company = await tx.company.findUniqueOrThrow({ where: { id: dto.company_id } });
            const { controlNumber, caseCode } = await this.generate(
                dto.company_id, company.abbreviation, tx,
            );

            const disciplinaryCaseReport = await tx.hrErCase.create({
                data: {
                    company_id: dto.company_id,
                    control_number: controlNumber,
                    case_code: caseCode,
                    incident_location: dto.incident_location,
                    assigned_location: dto.assigned_location,
                    incident_date: new Date(dto.incident_date),
                    report_date: new Date(dto.report_date),
                    incident_narrative: dto.incident_narrative,
                    created_by: user.id,
                    // parties: { 
                    //     create: dto.parties.map(p => ({ 
                    //         employee: { connect: { id: p.employee_id } }, 
                    //         role: p.role,
                    //         remarks: p.remarks,
                    //         createdBy: { connect: { id: user.id } },
                    //         // stage tracking only applies to respondents — complainants/witnesses stay null
                    //         ...(p.role === HrErCasePartyRole.respondent && {
                    //             level: p.level,
                    //             stage: HrErCaseStage.notice_to_explain,
                    //             stage_started_at: new Date(),
                    //             stage_logs: {
                    //                 create: {
                    //                     stage: HrErCaseStage.notice_to_explain,
                    //                     sla_days: SLA_DAYS[HrErCaseStage.notice_to_explain],
                    //                 },
                    //             },
                    //             offenses: {
                    //                 create: p.offense_ids!.map((offense_id) => ({
                    //                     offense: { connect: { id: offense_id } },
                    //                 })),
                    //             },
                    //             violations: {
                    //                 create: p.violation_ids!.map((violation_id) => ({
                    //                     violation: { connect: { id: violation_id } },
                    //                 })),
                    //             },
                    //         }),
                    //     })),
                    // },
                    parties: {
                        create: dto.parties.map((p) => ({
                            employee: { connect: { id: p.employee_id } },
                            role: p.role,
                            remarks: p.remarks,
                            createdBy: { connect: { id: user.id } },

                            // Stage tracking applies to all case parties
                            level: p.level,
                            stage: HrErCaseStage.notice_to_explain,
                            stage_started_at: new Date(),

                            stage_logs: {
                                create: {
                                    stage: HrErCaseStage.notice_to_explain,
                                    sla_days: SLA_DAYS[HrErCaseStage.notice_to_explain],
                                },
                            },

                            offenses: {
                                create: (p.offense_ids ?? []).map((offense_id) => ({
                                    offense: { 
                                        connect: { 
                                            id: offense_id 
                                        }, 
                                    },
                                })),
                            },

                            violations: {
                                create: (p.violation_ids ?? []).map((violation_id) => ({
                                    violation: { 
                                        connect: { 
                                            id: violation_id 
                                        }, 
                                    },
                                })),
                            },

                            ...(p.action && {
                                actions: {
                                    create: {
                                        action_type: p.action.action_type,
                                        effectivity_start: new Date(
                                            p.action.effectivity_start,
                                        ),
                                        effectivity_end: new Date(
                                            p.action.effectivity_end,
                                        ),
                                        remarks: p.action.remarks,
                                        createdBy: {
                                            connect: {
                                                id: user.id,
                                            },
                                        },
                                    },
                                },
                            }),
                        })),
                    },
                },
                include: { 
                    parties: {
                        include: { 
                            stage_logs: true, 
                            offenses: true, 
                            violations: true,
                            actions: true, 
                        },
                    },
                },
            });

            return {
                status: 'success',
                message: 'Disciplinary Case Report successfully created',
                disciplinaryCaseReport,
            };
        });
    }

    async noticeToExplain() {

    }

    async advanceAllEligible(caseId: string, user: RequestUser) {
        await this.assertHrAccess(user.id);

        return this.prisma.$transaction(async (tx) => {
            // const parties = await tx.hrErCaseParty.findMany({
            //     where: { case_id: caseId, role: 'respondent', stage: { not: 'case_closed' } },
            //     include: { nte: true, explanation: true, hearings: true, decision: true },
            // });

            const parties = await tx.hrErCaseParty.findMany({
                where: { case_id: caseId, role: 'respondent', stage: { not: null, notIn: ['case_closed'] } },
                include: { nte: true, explanation: true, hearings: true, decision: true },
            });

            const advanced: string[] = [];
            const skipped: { partyId: string; reason: string }[] = [];

            for (const party of parties) {
                const { eligible, reason } = this.checkPartyEligibility(party);

                if (!eligible) {
                    skipped.push({ partyId: party.id, reason: reason! });
                    await tx.hrErCaseActivityLog.create({
                        data: { case_id: caseId, party_id: party.id, actor_id: user.id, action: 'stage_advance_skipped', metadata: { reason } },
                    });
                    continue; // left behind — not included in the next stage, exactly as your PM described
                }

                if (!party.stage) {
                    // shouldn't happen given the query filter above, but keeps TS (and runtime) honest
                    skipped.push({ partyId: party.id, reason: 'Party has no stage set.' });
                    continue;
                }

                const next = STAGE_ORDER[STAGE_ORDER.indexOf(party.stage) + 1];

                await tx.hrErCaseStageLog.updateMany({
                    where: { party_id: party.id, stage: party.stage, exited_at: null },
                    data: { exited_at: new Date() },
                });
                await tx.hrErCaseStageLog.create({ data: { party_id: party.id, stage: next, sla_days: SLA_DAYS[next] } });
                await tx.hrErCaseParty.update({ where: { id: party.id }, data: { stage: next, stage_started_at: new Date() } });
                await tx.hrErCaseActivityLog.create({
                    data: { case_id: caseId, party_id: party.id, actor_id: user.id, action: `${next}_entered` },
                });

                advanced.push(party.id);
            }

            await this.recomputeCaseRollup(tx, caseId);
            return { advanced, skipped };
        });
    }



    async markNoResponse(partyId: string, user: RequestUser) {
        await this.assertHrAccess(user.id);
        
        return this.prisma.$transaction(async (tx) => {
            const party = await tx.hrErCaseParty.findUniqueOrThrow({ where: { id: partyId } });

            if (party.stage === HrErCaseStage.written_explanation) {
                await tx.hrErCaseExplanation.upsert({
                    where: { party_id: partyId },
                    create: { party_id: partyId, status: HrErExplanationStatus.no_response },
                    update: { status: HrErExplanationStatus.no_response }, 
                });
            } else if (party.stage === HrErCaseStage.administrative_hearing){
                await tx.hrErCaseHearing.updateMany({
                    where: { party_id: partyId, status: HrErHearingStatus.scheduled },
                    data: { status: HrErHearingStatus.no_show },
                });
            } else {
                throw new BadRequestException(`No-response marking isn't applicable at stage "${party.stage}".`);
            }

            await tx.hrErCaseActivityLog.create({
                data: {
                    case_id: party.case_id,
                    party_id: partyId,
                    actor_id: user.id,
                    action: `${party.stage}_no_response_marked` 
                },
            });
        });
    }
}
