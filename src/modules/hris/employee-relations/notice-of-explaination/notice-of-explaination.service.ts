import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  IssueNteDto,
  ReviewNteApprovalDto,
} from './dto/notice-of-explaination.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  HrErApprovalStatus,
  HrErApprovalStepType,
  HrErCasePartyRole,
  HrErCaseStage,
} from '@prisma/client';

@Injectable()
export class NoticeOfExplainationService {
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

  async issueNte(dto: IssueNteDto, user: RequestUser) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      const party = await tx.hrErCaseParty.findUniqueOrThrow({
        where: { id: dto.party_id },
      });

      if (party.case_id !== dto.disciplinary_case_id) {
        throw new BadRequestException('Party does not belong to this case.');
      }

      if (party.role !== HrErCasePartyRole.respondent) {
        throw new BadRequestException('Only respondents can be issued an NTE.');
      }

      if (party.stage !== HrErCaseStage.notice_to_explain) {
        throw new BadRequestException(
          `Party is at stage "${party.stage}", not notice_to explain`,
        );
      }

      const existing = await tx.hrErCaseNte.findUnique({
        where: { party_id: dto.party_id },
      });

      if (existing?.issued_at) {
        throw new ConflictException(
          'An NTE has already been issued for this respondent.',
        );
      }

      // Reviewers must be real users - fail loudly rather than creating orphaned approval row
      const reviewers = await tx.user.findMany({
        where: {
          id: { in: dto.reviewer_ids },
        },
        select: {
          id: true,
        },
      });

      if (reviewers.length !== dto.reviewer_ids.length) {
        throw new BadRequestException(
          'One or more reviewer_ids do not match an existing user.',
        );
      }

      const nte = await tx.hrErCaseNte.upsert({
        where: { party_id: dto.party_id },
        create: {
          party_id: dto.party_id,
          issued_at: new Date(),
          due_date: dto.due_date ? new Date(dto.due_date) : null,
          service_channel: dto.service_channel,
          reference_number: dto.reference_number,
          form_url: dto.form_url,
          status: HrErApprovalStatus.pending,
          created_by: user.id,
          approvals: {
            create: dto.reviewer_ids.map((reviewerId, index) => ({
              step_type: HrErApprovalStepType.nte_review,
              reviewer_id: reviewerId,
              sequence: index,
            })),
          },
        },
        update: {
          issued_at: new Date(),
          due_date: dto.due_date ? new Date(dto.due_date) : null,
          service_channel: dto.service_channel,
          reference_number: dto.reference_number,
          form_url: dto.form_url,
          status: HrErApprovalStatus.pending,
          updated_by: user.id,
          approvals: {
            create: dto.reviewer_ids.map((reviewerId, index) => ({
              step_type: HrErApprovalStepType.nte_review,
              reviewer_id: reviewerId,
              sequence: index,
            })),
          },
        },
        include: {
          approvals: true,
        },
      });

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: dto.disciplinary_case_id,
          party_id: dto.party_id,
          actor_id: user.id,
          action: 'nte_issued',
        },
      });

      return {
        status: 'success',
        message: 'NTE issued and reviewers assigned',
        nte,
      };
    });
  }

  async reviewNteApproval(
    nteId: string,
    approvalId: string,
    dto: ReviewNteApprovalDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      const approval = await tx.hrErCaseApproval.findUniqueOrThrow({
        where: { id: approvalId },
        include: {
          nte: {
            include: {
              party: true,
              approvals: true,
            },
          },
        },
      });

      console.log('Approval id', approval.id);

      if (
        approval.step_type !== HrErApprovalStepType.nte_review ||
        !approval.nte
      ) {
        throw new BadRequestException(
          'This approval is not an NTE review step.',
        );
      }

      // if (approval.reviewer_id !== user.id) {
      //     throw new ForbiddenException('Only the assigned reviewer can act on this approval.');
      // }

      if (approval.status !== HrErApprovalStatus.pending) {
        throw new ConflictException(
          `This approval was already marked "${approval.status}.`,
        );
      }

      await tx.hrErCaseApproval.update({
        where: { id: approvalId },
        data: {
          status: dto.status,
          remarks: dto.remarks,
          reviewed_at: new Date(),
        },
      });

      // Role update the overall NTE status from all reviewers on this NTE
      const siblingApprovals = await tx.hrErCaseApproval.findMany({
        where: { nte_id: approval.nte.id },
      });
      const updated = siblingApprovals.map((a) =>
        a.id === approvalId ? { ...a, status: dto.status } : a,
      );

      const nteStatus = updated.some((a) => a.status === 'revise')
        ? HrErApprovalStatus.revise
        : updated.some((a) => a.status === 'rejected')
          ? HrErApprovalStatus.rejected
          : updated.every((a) => a.status === 'approved')
            ? HrErApprovalStatus.approved
            : HrErApprovalStatus.pending;

      const erCaseNte = await tx.hrErCaseNte.update({
        where: { id: nteId },
        data: {
          status: nteStatus,
          updated_by: user.id,
        },
      });

      console.log('CaseNteId', erCaseNte.id);

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: approval.nte.party.case_id,
          party_id: approval.nte.party_id,
          actor_id: user.id,
          action: `nte_review_${dto.status}`,
        },
      });

      return {
        status: 'success',
        message: `NTE review marked as ${dto.status}`,
        nteStatus,
      };
    });
  }
}
