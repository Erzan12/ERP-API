import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateNteDto,
  ReviewNteApprovalDto,
  UpdateNteDto,
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

  async getNte(nteId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const nte = await this.prisma.hrErCaseNte.findUnique({
      where: { id: nteId },
      include: {
        approvals: {
          include: {
            reviewer: {
              select: {
                id: true,
                employee: {
                  select: {
                    id: true,
                    employee_id: true,
                    person: {
                      select: {
                        first_name: true,
                        middle_name: true,
                        last_name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        attachments: true,
      },
    });

    if (!nte) {
      throw new NotFoundException('No available NTEs found.');
    }

    return {
      status: 'success',
      message: 'Here is the NTE',
      nte,
    };
  }

  async createNte(dto: CreateNteDto, user: RequestUser) {
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

      const nte = await tx.hrErCaseNte.create({
        data: {
          party_id: dto.party_id,
          // issued_at: new Date(),
          due_date: dto.due_date ? new Date(dto.due_date) : null,
          service_channel: dto.service_channel,
          reference_number: dto.reference_number,
          form_url: dto.form_url,
          status: HrErApprovalStatus.revise,
          created_by: user.id,
          approvals: {
            create: dto.reviewer_ids.map((reviewerId, index) => ({
              step_type: HrErApprovalStepType.nte_review,
              reviewer_id: reviewerId,
              sequence: index,
              created_by: user.id,
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
          action: 'nte_created',
        },
      });

      return {
        status: 'success',
        message: 'NTE has been created successfully.',
        nte,
      };
    });
  }

  async updateNte(
    nteId: string,
    user: RequestUser,
    dto: UpdateNteDto,
  ) {
    await this.assertHrAccess(user.id);

    const existingNte = await this.prisma.hrErCaseNte.findUnique({
      where: { id: nteId },
    });

    if (!existingNte) {
      throw new NotFoundException('NTE does not exist.');
    }

    return this.prisma.$transaction(async (tx) => {
      /**
       * Use the existing party_id when party_id is not
       * provided in the update DTO.
       */
      const partyId = dto.party_id ?? existingNte.party_id;

      const party = await tx.hrErCaseParty.findUniqueOrThrow({
        where: {
          id: partyId,
        },
      });

      /**
       * Only validate the case when disciplinary_case_id
       * was supplied.
       */
      if (
        dto.disciplinary_case_id &&
        party.case_id !== dto.disciplinary_case_id
      ) {
        throw new BadRequestException(
          'Party does not belong to this case.',
        );
      }

      /**
       * Only respondents can have an NTE.
       */
      if (party.role !== HrErCasePartyRole.respondent) {
        throw new BadRequestException(
          'Only respondents can be issued an NTE.',
        );
      }

      /**
       * Validate party stage.
       */
      if (party.stage !== HrErCaseStage.notice_to_explain) {
        throw new BadRequestException(
          `Party is at stage "${party.stage}", not notice_to_explain`,
        );
      }

      /**
       * Prevent updating an NTE if another NTE already exists
       * for the selected party.
       *
       * Ignore the current NTE itself.
       */
      const existing = await tx.hrErCaseNte.findFirst({
        where: {
          party_id: partyId,
          NOT: {
            id: existingNte.id,
          },
        },
      });

      if (existing?.issued_at) {
        throw new ConflictException(
          'An NTE has already been issued for this respondent.',
        );
      }
      
      if (existing?.status === HrErApprovalStatus.verified || HrErApprovalStatus.approved || HrErApprovalStatus.rejected) {
        throw new BadRequestException('NTE cannot be updated anymore it is either already verified, approved or rejected already');
      } 

      /**
       * =========================================================
       * APPROVAL / REVIEWER UPDATE
       * =========================================================
       *
       * reviewer_ids has three possible behaviors:
       *
       * 1. reviewer_ids is undefined
       *    -> Don't modify existing approvals.
       *
       * 2. reviewer_ids is []
       *    -> Delete all approvals.
       *
       * 3. reviewer_ids contains IDs
       *    -> The array becomes the source of truth.
       *       Reviewers not included are deleted.
       *       New reviewers are created.
       */
      if (dto.reviewer_ids !== undefined) {
        /**
         * Validate reviewer IDs.
         *
         * An empty array is allowed because it means
         * "remove all reviewers."
         */
        if (dto.reviewer_ids.length > 0) {
          const reviewers = await tx.user.findMany({
            where: {
              id: {
                in: dto.reviewer_ids,
              },
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
        }

        /**
         * Delete approvals whose reviewer is no longer
         * included in the submitted reviewer_ids.
         *
         * If reviewer_ids is [] then notIn: [] causes
         * all existing approvals to be deleted.
         */
        await tx.hrErCaseApproval.deleteMany({
          where: {
            nte_id: existingNte.id,
            reviewer_id: {
              notIn: dto.reviewer_ids,
            },
          },
        });

        /**
         * Get the remaining approvals.
         */
        const existingApprovals =
          await tx.hrErCaseApproval.findMany({
            where: {
              nte_id: existingNte.id,
            },
            select: {
              reviewer_id: true,
            },
          });

        const existingReviewerIds = new Set(
          existingApprovals.map(
            (approval) => approval.reviewer_id,
          ),
        );

        /**
         * Find reviewers that were newly added.
         */
        const newReviewerIds = dto.reviewer_ids.filter(
          (reviewerId) =>
            !existingReviewerIds.has(reviewerId),
        );

        /**
         * Create newly-added reviewers.
         */
        if (newReviewerIds.length > 0) {
          await tx.hrErCaseApproval.createMany({
            data: newReviewerIds.map((reviewerId) => ({
              nte_id: existingNte.id,
              step_type: HrErApprovalStepType.nte_review,
              reviewer_id: reviewerId,
              sequence:
                dto.reviewer_ids!.indexOf(reviewerId),
              created_by: user.id,
            })),
          });
        }

        /**
         * Recalculate sequence based on the order
         * supplied in reviewer_ids.
         *
         * Example:
         *
         * reviewer_ids: [A, C, B]
         *
         * A -> sequence 0
         * C -> sequence 1
         * B -> sequence 2
         */
        for (const [
          index,
          reviewerId,
        ] of dto.reviewer_ids.entries()) {
          await tx.hrErCaseApproval.updateMany({
            where: {
              nte_id: existingNte.id,
              reviewer_id: reviewerId,
            },
            data: {
              sequence: index,
              updated_by: user.id,
            },
          });
        }
      }

      /**
       * =========================================================
       * UPDATE NTE
       * =========================================================
       */
      const updatedNte = await tx.hrErCaseNte.update({
        where: {
          id: existingNte.id,
        },
        data: {
          party_id: dto.party_id ?? existingNte.party_id,

          due_date: dto.due_date
            ? new Date(dto.due_date)
            : existingNte.due_date,

          service_channel:
            dto.service_channel ??
            existingNte.service_channel,

          // reference_number:
          //   dto.reference_number ??
          //   existingNte.reference_number,

          // form_url:
          //   dto.form_url ??
          //   existingNte.form_url,

          updated_by: user.id,
        },
        include: {
          approvals: {
            include: {
              reviewer: {
                select: {
                  id: true,
                  employee: {
                    select: {
                      id: true,
                      person: {
                        select: {
                          first_name: true,
                          middle_name: true,
                          last_name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: {
              sequence: 'asc',
            },
          },
        },
      });

      /**
       * =========================================================
       * RESPONSE
       * =========================================================
       */
      return {
        status: 'success',
        message: 'NTE has been updated successfully.',
        nte: updatedNte,
      };
    });
  }

  async submitNte(nteId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      const nte = await tx.hrErCaseNte.findUniqueOrThrow({
        where: { id: nteId },
        include: {
          party: true,
          approvals: true,
        },
      });

      if (!nte) {
        throw new NotFoundException('NTE does not exists.');
      }

      if (nte.party.role !== HrErCasePartyRole.respondent) {
        throw new BadRequestException('Only respondents can be issued an NTE.');
      }

      if (nte.party.stage !== HrErCaseStage.notice_to_explain) {
        throw new BadRequestException(
          `Party is at stage "${nte.party.stage}", not notice_to_explain`,
        );
      }

      const existing = await tx.hrErCaseNte.findUnique({
        where: { party_id: nte.party.id },
      });

      // if (existing?.issued_at) {
      //   throw new ConflictException(
      //     'An NTE has already been issued for this respondent.',
      //   );
      // }

      if (existing?.status === HrErApprovalStatus.verified) {
        throw new BadRequestException('NTE has been submitted already.');
      }

      return this.prisma.$transaction(async (tx) => {
        await tx.hrErCaseApproval.updateMany({
          where: { nte_id: nteId },
          data: {
            status: HrErApprovalStatus.pending,
            updated_by: user.id,
          },
        });

        const updateNteStatus = await tx.hrErCaseNte.update({
          where: { id: nteId },
          data: {
            status: HrErApprovalStatus.pending,
            updated_by: user.id,
          },
          include: {
            approvals: true,
          },
        });

        return {
          status: 'success',
          message: 'NTE has been submitted.',
          updateNteStatus,
        };
      });
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

      // if (approval.status !== HrErApprovalStatus.revise) {
      //   throw new BadRequestException('NTE Status must be revise before it can be reviewed and must be submitted first.')
      // }

      if (approval.status !== HrErApprovalStatus.pending) {
        throw new ConflictException(
          `NTE must be submitted first since status is still revise.`,
        );
      }

      const reviewNTEApproval = await tx.hrErCaseApproval.update({
        where: { id: approvalId, status: HrErApprovalStatus.pending },
        data: {
          status: dto.status,
          remarks: dto.remarks,
          reviewed_at: new Date(),
          updated_by: user.id,
        },
      });

      // // Get the latest approval statuses
      // const approvals = await tx.hrErCaseApproval.findMany({
      //   where: {
      //     nte_id: nteId,
      //     step_type: HrErApprovalStepType.nte_review,
      //   },
      // });

      // // Determine the NTE status
      // let nteStatus: HrErApprovalStatus;

      // if (approvals.some((a) => a.status === HrErApprovalStatus.revise)) {
      //   nteStatus = HrErApprovalStatus.revise;
      // } else if (
      //   approvals.some((a) => a.status === HrErApprovalStatus.rejected)
      // ) {
      //   nteStatus = HrErApprovalStatus.rejected;
      // } else if (
      //   approvals.length > 0 &&
      //   approvals.every((a) => a.status === HrErApprovalStatus.approved)
      // ) {
      //   nteStatus = HrErApprovalStatus.verified;
      // } else {
      //   nteStatus = HrErApprovalStatus.pending;
      // }

      // const erCaseNte = await tx.hrErCaseNte.update({
      //   where: { id: nteId },
      //   data: {
      //     status: nteStatus,
      //     updated_by: user.id,
      //   },
      // });

      // console.log('CaseNteId', erCaseNte.id);

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
        reviewNTEApproval,
      };
    });
  }

  async issueNte(partyId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      const party = await tx.hrErCaseParty.findUniqueOrThrow({
        where: { id: partyId },
      });

      if (party.role !== HrErCasePartyRole.respondent) {
        throw new BadRequestException('Only respondents can be issued an NTE.');
      }

      if (party.stage !== HrErCaseStage.notice_to_explain) {
        throw new BadRequestException(
          `Party is at stage "${party.stage}", not notice_to explain`,
        );
      }

      const existing = await tx.hrErCaseNte.findUnique({
        where: { party_id: party.id },
      });

      if (existing?.issued_at) {
        throw new ConflictException(
          'An NTE has already been issued for this respondent.',
        );
      }

      // const nte = await tx.hrErCaseNte.upsert({
      //   where: { party_id: dto.party_id },
      //   create: {
      //     party_id: dto.party_id,
      //     issued_at: new Date(),
      //     due_date: dto.due_date ? new Date(dto.due_date) : null,
      //     service_channel: dto.service_channel,
      //     reference_number: dto.reference_number,
      //     form_url: dto.form_url,
      //     status: HrErApprovalStatus.pending,
      //     created_by: user.id,
      //     approvals: {
      //       create: dto.reviewer_ids.map((reviewerId, index) => ({
      //         step_type: HrErApprovalStepType.nte_review,
      //         reviewer_id: reviewerId,
      //         sequence: index,
      //       })),
      //     },
      //   },
      //   update: {
      //     issued_at: new Date(),
      //     due_date: dto.due_date ? new Date(dto.due_date) : null,
      //     service_channel: dto.service_channel,
      //     reference_number: dto.reference_number,
      //     form_url: dto.form_url,
      //     status: HrErApprovalStatus.pending,
      //     updated_by: user.id,
      //     approvals: {
      //       create: dto.reviewer_ids.map((reviewerId, index) => ({
      //         step_type: HrErApprovalStepType.nte_review,
      //         reviewer_id: reviewerId,
      //         sequence: index,
      //       })),
      //     },
      //   },
      //   include: {
      //     approvals: true,
      //   },
      // });

      const nte = await tx.hrErCaseNte.update({
        where: { party_id: partyId },
        data: {
          issued_at: new Date(),
          status: HrErApprovalStatus.verified,
          updated_by: user.id,
        },
        include: {
          approvals: true,
        },
      });

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: party.case_id,
          party_id: party.id,
          actor_id: user.id,
          action: 'nte_issued',
        },
      });

      return {
        status: 'success',
        message: 'NTE has been issued.',
        nte,
      };
    });
  }
}
