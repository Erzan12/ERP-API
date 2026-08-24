import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SubmitExplainationDto } from './dto/submit-explanation.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  HrErCasePartyRole,
  HrErCaseStage,
  HrErExplanationChannel,
  HrErExplanationStatus,
} from '@prisma/client';

@Injectable()
export class WrittenExplainationService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper for auth check
  private async assertHrAccess(userId: string) {
    const requestUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: {
          include: {
            person: true,
            position: true,
          },
        },
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

  async submitWrittenExplanation(
    dto: SubmitExplainationDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      const party = await tx.hrErCaseParty.findUniqueOrThrow({
        where: {
          id: dto.party_id,
        },
      });

      if (party.case_id !== dto.disciplinary_case_id) {
        throw new BadRequestException('Party does not belong to this case.');
      }

      if (party.role !== HrErCasePartyRole.respondent) {
        throw new BadRequestException(
          'Only respondents submit a written explanation.',
        );
      }

      if (party.stage !== HrErCaseStage.written_explanation) {
        throw new BadRequestException(
          `Party is at stage "${party.stage}", not written explanation.`,
        );
      }

      const existing = await tx.hrErCaseExplanation.findUnique({
        where: { party_id: dto.party_id },
      });

      if (existing?.status === HrErExplanationStatus.received) {
        throw new ConflictException(
          'An explanation has already been recorded for this respondent.',
        );
      }

      if (
        dto.channel !== HrErExplanationChannel.did_not_proceed &&
        !dto.response_text &&
        !dto.file_url
      ) {
        throw new BadRequestException(
          'Provide response_text or file_url, or select "did not proceed".',
        );
      }

      const explanation = await tx.hrErCaseExplanation.upsert({
        where: { party_id: dto.party_id },
        create: {
          party_id: dto.party_id,
          status: HrErExplanationStatus.received,
          channel: dto.channel,
          response_text: dto.response_text,
          file_url: dto.file_url,
          received_at: new Date(),
          created_by: user.id,
        },
        update: {
          status: HrErExplanationStatus.received,
          channel: dto.channel,
          response_text: dto.response_text,
          file_url: dto.file_url,
          received_at: new Date(),
          updated_by: user.id,
        },
      });

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: dto.disciplinary_case_id,
          party_id: dto.party_id,
          actor_id: user.id,
          action: 'written_explanation_received',
        },
      });

      return {
        status: 'success',
        message: 'Written explanation recorded',
        explanation,
      };
    });
  }
}
