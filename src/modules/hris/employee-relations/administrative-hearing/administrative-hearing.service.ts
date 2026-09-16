import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  HrErCasePartyRole,
  HrErCaseStage,
  HrErHearingStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  RescheduleHearingDto,
  ScheduleHearingDto,
} from './dto/schedule-hearing.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ConductHearingDto } from './dto/conduct-hearing.dto';

@Injectable()
export class AdministrativeHearingService {
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

  async scheduleHearing(dto: ScheduleHearingDto, user: RequestUser) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      await this.assertRespondentAtStage(
        tx,
        dto.disciplinary_case_id,
        dto.party_id,
        HrErCaseStage.administrative_hearing,
      );

      const activeScheduled = await tx.hrErCaseHearing.findFirst({
        where: { party_id: dto.party_id, status: HrErHearingStatus.scheduled },
      });

      if (activeScheduled) {
        throw new ConflictException(
          'A hearing is already scheduled - use reschedule instead.',
        );
      }

      const hearing = await tx.hrErCaseHearing.create({
        data: {
          party_id: dto.party_id,
          scheduled_at: new Date(dto.scheduled_at),
          // scheduled_start_at: new Date(dto.scheduled_start_at),
          // scheduled_end_at: new Date(dto.scheduled_end_at),
          channel: dto.channel,
          status: HrErHearingStatus.scheduled,
          remarks: dto.remarks,
          created_by: user.id,
          committee: {
            create:  dto.committee_ids.map((employeeId) => ({
              employee: { connect: { id: employeeId } },
              notified_at: new Date(),
              createdBy: { connect: { id: user.id } },
            }))
          }
        },
        include: {
          committee: true,
        }
      });

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: dto.disciplinary_case_id,
          party_id: dto.party_id,
          actor_id: user.id,
          action: 'hearing_scheduled',
        },
      });

      return {
        status: 'success',
        message: 'Hearing scheduled with Hearing committee added',
        hearing,
      };
    });
  }

  async rescheduleHearing(
    disciplinaryCaseId: string,
    partyId: string,
    dto: RescheduleHearingDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      await this.assertRespondentAtStage(
        tx,
        disciplinaryCaseId,
        partyId,
        HrErCaseStage.administrative_hearing,
      );

      const activeScheduled = await tx.hrErCaseHearing.findFirst({
        where: { party_id: partyId, status: HrErHearingStatus.scheduled },
      });

      if (!activeScheduled) {
        throw new BadRequestException(
          'No active scheduled hearing to reschedule - use schedule instead.',
        );
      }

      await tx.hrErCaseHearing.update({
        where: { id: activeScheduled.id },
        data: {
          status: HrErHearingStatus.rescheduled,
          updated_by: user.id,
        },
      });

      const hearing = await tx.hrErCaseHearing.create({
        data: {
          party_id: partyId,
          scheduled_at: new Date(dto.scheduled_at),
          channel: dto.channel,
          status: HrErHearingStatus.rescheduled,
          remarks: dto.remarks,
          created_by: user.id,
        },
      });

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: disciplinaryCaseId,
          party_id: partyId,
          actor_id: user.id,
          action: 'hearing_rescheduled',
        },
      });

      return {
        status: 'success',
        message: 'Hearing rescheduled',
        hearing,
      };
    });
  }

  async conductHearing(
    disciplinaryCaseId: string,
    partyId: string,
    dto: ConductHearingDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      await this.assertRespondentAtStage(
        tx,
        disciplinaryCaseId,
        partyId,
        HrErCaseStage.administrative_hearing,
      );

      const activeScheduled = await tx.hrErCaseHearing.findFirst({
        where: {
          party_id: partyId,
          status: HrErHearingStatus.scheduled,
        },
      });

      const hearing = activeScheduled
        ? await tx.hrErCaseHearing.update({
            where: { id: activeScheduled.id },
            data: {
              status: HrErHearingStatus.conducted,
              channel: dto.channel,
              minutes_file_url: dto.minutes_file_url,
              remarks: dto.remarks ?? activeScheduled.remarks,
              updated_by: user.id,
            },
          })
        : await tx.hrErCaseHearing.create({
            data: {
              party_id: partyId,
              scheduled_at: new Date(), // walk-in - no prior schedule
              channel: dto.channel,
              status: HrErHearingStatus.conducted,
              minutes_file_url: dto.minutes_file_url,
              remarks: dto.remarks,
              created_by: user.id,
            },
          });

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: disciplinaryCaseId,
          party_id: partyId,
          actor_id: user.id,
          action: 'hearing_conducted',
        },
      });

      return {
        status: 'success',
        message: 'Hearing marked as conducted',
        hearing,
      };
    });
  }
}
