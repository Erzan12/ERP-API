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
import { logActivity } from '../activity-grouping-helper/activity-log.helper';

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

  private async assertExistingHearing(
    tx: Prisma.TransactionClient,
    hearingId: string,
    partyId: string,
    expectedStage: HrErCaseStage,
  ) {
    const hearing = await tx.hrErCaseHearing.findUniqueOrThrow({
      where: { id: hearingId, party_id: partyId },
      include: {
        party: true,
      },
    });

    if (hearing.id !== hearingId) {
      throw new BadRequestException('Party does not belong to this case.');
    }

    if (hearing.party.role !== HrErCasePartyRole.respondent) {
      throw new BadRequestException('Only respondents apply here.');
    }

    if (hearing.party.stage !== expectedStage) {
      throw new BadRequestException(
        `Party is at stage "${hearing.party.stage}", not ${expectedStage}.`,
      );
    }

    return hearing;
  }

  private async assertRespondentStage(
    tx: Prisma.TransactionClient,
    disciplinaryCaseId: string,
    partyId: string,
    expectedStage: HrErCaseStage,
  ) {
    const party = await tx.hrErCaseParty.findUniqueOrThrow({
      where: { id: partyId, case_id: disciplinaryCaseId},
    });

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
      
      await this.assertRespondentStage(
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
            create: dto.committee_ids.map((employeeId) => ({
              employee: { connect: { id: employeeId } },
              notified_at: new Date(),
              createdBy: { connect: { id: user.id } },
            })),
          },
        },
        include: {
          committee: true,
        },
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
    hearingId: string,
    partyId: string,
    dto: RescheduleHearingDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      await this.assertExistingHearing(
        tx,
        hearingId,
        partyId,
        HrErCaseStage.administrative_hearing,
      );

      const activeScheduled = await tx.hrErCaseHearing.findFirst({
        where: {
          id: hearingId,
          party_id: partyId,
          status: HrErHearingStatus.scheduled,
        },
        include: {
          party: true,
        },
      });

      if (!activeScheduled) {
        throw new BadRequestException(
          'No active scheduled hearing to reschedule - use schedule instead.',
        );
      }

      const rescheduleHearing = await tx.hrErCaseHearing.update({
        where: { id: activeScheduled.id },
        data: {
          scheduled_at: new Date(dto.scheduled_at),
          channel: dto.channel,
          status: HrErHearingStatus.rescheduled,
          updated_by: user.id,
        },
      });

      // const hearing = await tx.hrErCaseHearing.create({
      //   data: {
      //     party_id: partyId,
      //     scheduled_at: new Date(dto.scheduled_at),
      //     channel: dto.channel,
      //     status: HrErHearingStatus.rescheduled,
      //     remarks: dto.remarks,
      //     created_by: user.id,
      //   },
      // });

      await logActivity(tx, {
        case_id: activeScheduled.party.case_id,
        party_id: partyId,
        actor_id: user.id,
        stage: HrErCaseStage.administrative_hearing,
        action: 'hearing_rescheduled',
        metadata: { hearing_id: activeScheduled.id },
      });

      return {
        status: 'success',
        message: 'Hearing rescheduled',
        rescheduleHearing,
      };
    });
  }

  async conductHearing(
    hearingId: string,
    partyId: string,
    dto: ConductHearingDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      await this.assertExistingHearing(
        tx,
        hearingId,
        partyId,
        HrErCaseStage.administrative_hearing,
      );

      const activeScheduled = await tx.hrErCaseHearing.findFirst({
        where: {
          id: hearingId,
          status: { not: HrErHearingStatus.conducted },
        },
        include: {
          party: true,
        },
      });

      if (!activeScheduled) {
        throw new BadRequestException(
          'No active scheduled hearing to conduct - please confirm if hearing is scheduled.',
        );
      }

      const hearing = activeScheduled
        ? await tx.hrErCaseHearing.update({
            where: { id: activeScheduled.id },
            data: {
              status: HrErHearingStatus.conducted,
              channel: dto.channel,
              // minutes_file_url: dto.minutes_file_url,
              // remarks: dto.remarks ?? activeScheduled.remarks,
              updated_by: user.id,
            },
          })
        : await tx.hrErCaseHearing.create({
            data: {
              party_id: partyId,
              scheduled_at: new Date(), // walk-in - no prior schedule
              channel: dto.channel,
              status: HrErHearingStatus.conducted,
              // minutes_file_url: dto.minutes_file_url,
              // remarks: dto.remarks,
              created_by: user.id,
            },
          });

      await logActivity(tx, {
        case_id: activeScheduled.party.case_id,
        party_id: partyId,
        actor_id: user.id,
        stage: HrErCaseStage.administrative_hearing,
        action: 'hearing_conducted',
        metadata: { hearing_id: activeScheduled.id },
      });

      return {
        status: 'success',
        message: 'Hearing marked as complete and is conducted',
        hearing,
      };
    });
  }

  // async hearingAttendance(dto: AttendeeHearingDto, user: RequestUser) {
  //   await this.assertHrAccess(user.id);

  //   const existingHearing = await this.prisma.hrErCaseHearing.findUnique({
  //     where: { id: dto.hearing_id }
  //   });

  //   if (!existingHearing) {
  //     throw new NotFoundException('Hearing does not exists.');
  //   }

  //   const hearingAttendance = await this.prisma.hrErCaseHearingAttendee.create({
  //     data: {
  //       hearing_id: dto.hearing_id,
  //       name: dto.name,
  //       position: dto.position,
  //       created_by: user.id,
  //     },
  //   });

  //   return {
  //     status: 'success',
  //     message: 'Hearing Attendee added successfully',
  //     hearingAttendance,
  //   }
  // }

  // async hearingMinutes(hearingId: string, dto: MinutesHearingDto, user: RequestUser) {
  //   await this.assertHrAccess(user.id);

  //   const existingHearing = await this.prisma.hrErCaseHearing.findUnique({
  //     where: { id: hearingId },
  //   });

  //   if (!existingHearing) {
  //     throw new NotFoundException('Hearing does not exists.');
  //   }

  //   const hearingMinutes = await this.prisma.hrErCaseHearing.update({
  //     where: { id: existingHearing.id },
  //     data: {
  //       minutes_started_at: new Date(dto.minutes_start_at),
  //       minutes_ended_at: new Date(dto.minutes_end_at),
  //       respondent_statement: dto.respondent_statement,
  //       remarks: dto.remarks,
  //       updated_by: user.id
  //     },
  //   });

  //   return {
  //     status: 'success',
  //     message: 'Hearing minutes successfully added.',
  //     hearingMinutes,
  //   };
  // }
}
