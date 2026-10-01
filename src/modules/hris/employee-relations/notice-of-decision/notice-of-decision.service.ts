import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  HrErCasePartyRole,
  HrErCaseStage,
  HrErDecisionStatus,
  Prisma,
} from '@prisma/client';
import { CreateDecisionDto, UpdateDecisionDto } from './dto/decision.dto';

@Injectable()
export class NoticeOfDecisionService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getNoticeOfDecision(decisionId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const decision = await this.prisma.hrErCaseDecision.findUnique({
      where: { id: decisionId },
      include: {
        deduct_payroll: true,
        attachment: true,
      },
    });

    if (!decision) {
      throw new NotFoundException('Notice of decision does not exists.');
    }

    return {
      status: 'success',
      message: 'Here is the Notice of Decision',
      decision,
    };
  }

  async createNoticeOfDecision(dto: CreateDecisionDto, user: RequestUser) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      await this.assertRespondentAtStage(
        tx,
        dto.disciplinary_case_id,
        dto.party_id,
        HrErCaseStage.notice_of_decision,
      );

      // const existing = await tx.hrErCaseDecision.findUnique({
      //   where: { party_id: dto.party_id },
      //   include: {
      //     party: true,
      //   },
      // });

      // if (existing?.issued_at) {
      //   throw new ConflictException(
      //     'A decision has already been issued for this respondent.',
      //   );
      // }

      if (dto.effectivity_start && dto.effectivity_end) {
        const start = new Date(dto.effectivity_start);
        const end = new Date(dto.effectivity_end);
        if (start >= end) {
          throw new BadRequestException(
            'Effectivity end must be later than the start date.',
          );
        }
      }

      const decision = await tx.hrErCaseDecision.create({
        data: {
          party_id: dto.party_id,
          decision_type: dto.decision_type,
          effectivity_start: dto.effectivity_start,
          // ? new Date(dto.effectivity_start)
          // : null,
          effectivity_end: dto.effectivity_end,
          // ? new Date(dto.effectivity_end)
          // : null,
          signed_file_url: 'string',
          remarks: dto.remarks,
          // issued_at: new Date(),
          created_by: user.id,
          deduct_payroll: dto.deduct_payroll
            ? {
                create: {
                  deduction_start: dto.deduct_payroll.deduction_start
                    ? new Date(dto.deduct_payroll.deduction_start)
                    : null,
                  deduction_end: dto.deduct_payroll.deduction_end
                    ? new Date(dto.deduct_payroll.deduction_end)
                    : null,
                  total_deduction: dto.deduct_payroll.total_deduction,
                  semi_monthly_deduction:
                    dto.deduct_payroll.semi_monthly_deduction,
                  decision_remarks: dto.deduct_payroll.decision_remarks,
                  created_by: user.id,
                },
              }
            : undefined,
        },
        include: {
          deduct_payroll: true,
          attachment: true,
        },
      });

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: dto.disciplinary_case_id,
          party_id: dto.party_id,
          actor_id: user.id,
          action: 'notice_of_decision_create',
        },
      });

      return {
        status: 'success',
        message: 'Notice of Decision created',
        decision,
      };
    });
  }

  async updateNoticeOfDecision(
    decisionId: string,
    dto: UpdateDecisionDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      // await this.assertRespondentAtStage(
      //   tx,
      //   // dto.disciplinary_case_id,
      //   // dto.party_id,
      //   HrErCaseStage.notice_of_decision,
      // );

      const existing = await tx.hrErCaseDecision.findUnique({
        where: { id: decisionId, status: { not: HrErDecisionStatus.issued } },
        include: {
          party: true,
        },
      });

      if (!existing) {
        throw new BadRequestException('Notice of Decision does not exists.');
      }

      if (existing?.issued_at) {
        throw new ConflictException(
          'A decision has already been issued for this respondent.',
        );
      }

      // if (dto.effectivity_start && dto.effectivity_end) {
      //   const start = new Date(dto.effectivity_start);
      //   const end = new Date(dto.effectivity_end);
      //   if (start >= end) {
      //     throw new BadRequestException(
      //       'Effectivity end must be later than the start date.',
      //     );
      //   }
      // }

      const decision = await tx.hrErCaseDecision.update({
        where: { id: decisionId },
        data: {
          decision_type: dto.decision_type ?? existing.decision_type,
          effectivity_start: dto.effectivity_start
            ? new Date(dto.effectivity_start)
            : null,
          effectivity_end: dto.effectivity_end
            ? new Date(dto.effectivity_end)
            : null,
          // signed_file_url: dto.signed_file_url,
          remarks: dto.remarks ?? existing.remarks,
          // issued_at: new Date(),
          updated_by: user.id,
          deduct_payroll: dto.deduct_payroll
            ? {
                upsert: {
                  create: {
                    deduction_start: dto.deduct_payroll.deduction_start
                      ? new Date(dto.deduct_payroll.deduction_start)
                      : null,
                    deduction_end: dto.deduct_payroll.deduction_end
                      ? new Date(dto.deduct_payroll.deduction_end)
                      : null,
                    total_deduction: dto.deduct_payroll.total_deduction,
                    semi_monthly_deduction:
                      dto.deduct_payroll.semi_monthly_deduction,
                    decision_remarks: dto.deduct_payroll.decision_remarks,
                    created_by: user.id,
                  },
                  update: {
                    deduction_start: dto.deduct_payroll.deduction_start
                      ? new Date(dto.deduct_payroll.deduction_start)
                      : undefined,
                    deduction_end: dto.deduct_payroll.deduction_end
                      ? new Date(dto.deduct_payroll.deduction_end)
                      : undefined,
                    total_deduction: dto.deduct_payroll.total_deduction,
                    semi_monthly_deduction:
                      dto.deduct_payroll.semi_monthly_deduction,
                    decision_remarks: dto.deduct_payroll.decision_remarks,
                    updated_by: user.id,
                  },
                },
              }
            : undefined,
        },
        include: {
          deduct_payroll: true,
        },
      });

      // await tx.hrErCaseActivityLog.create({
      //   data: {
      //     case_id: existing.id,
      //     party_id: existing.party_id,
      //     actor_id: user.id,
      //     action: 'notice_of_decision_issued',
      //   },
      // });

      return {
        status: 'success',
        message: 'Notice of Decision updated',
        decision,
      };
    });
  }

  async submitNoticeOfDecision(decisionId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      // await this.assertRespondentAtStage(
      //   tx,
      //   // dto.disciplinary_case_id,
      //   // dto.party_id,
      //   HrErCaseStage.notice_of_decision,
      // );

      const existing = await tx.hrErCaseDecision.findUnique({
        where: { id: decisionId },
        include: {
          party: true,
        },
      });

      if (!existing) {
        throw new BadRequestException('Notice of Decision does not exists.');
      }

      if (existing?.issued_at) {
        throw new ConflictException(
          'A decision has already been issued for this respondent.',
        );
      }

      // if (dto.effectivity_start && dto.effectivity_end) {
      //   const start = new Date(dto.effectivity_start);
      //   const end = new Date(dto.effectivity_end);
      //   if (start >= end) {
      //     throw new BadRequestException(
      //       'Effectivity end must be later than the start date.',
      //     );
      //   }
      // }

      const decision = await tx.hrErCaseDecision.update({
        where: { id: decisionId },
        data: {
          status: HrErDecisionStatus.issued,
          // signed_file_url: dto.signed_file_url,
          issued_at: new Date(),
          updated_by: user.id,
        },
      });

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: existing.party.case_id,
          party_id: existing.party_id,
          actor_id: user.id,
          action: 'notice_of_decision_issued',
        },
      });

      return {
        status: 'success',
        message: 'Notice of Decision issued',
        decision,
      };
    });
  }
}
