import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdministrativeHearingService } from './administrative-hearing.service';
import {
  RescheduleHearingDto,
  ScheduleHearingDto,
} from './dto/schedule-hearing.dto';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ConductHearingDto } from './dto/conduct-hearing.dto';

@ApiTags('Human Resources - Employee Relations(Administrative Hearing)')
@Controller({ path: 'hris', version: '2' })
export class AdministrativeHearingController {
  constructor(
    private readonly administrativeHearingService: AdministrativeHearingService,
  ) {}

  @Post('employee-relations/administrative-hearing/parties')
  @ApiOperation({
    summary: 'Scheduled an administrative hearing for a respondent.',
  })
  scheduleHearing(
    @Body() dto: ScheduleHearingDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.administrativeHearingService.scheduleHearing(dto, user);
  }

  // @Post('employee-relations/administrative-hearing/hearing-attendee')
  // @ApiOperation({
  //   summary: 'Add the details of the Hearing Attendee',
  // })
  // hearingAttendance(
  //   @Body() dto: AttendeeHearingDto,
  //   @SessionUser() user: RequestUser,
  // ) {
  //   return this.administrativeHearingService.hearingAttendance(dto, user);
  // }

  @Put(
    'employee-relations/administrative-hearing/:hearingId/parties/:partyId/reschedule',
  )
  @ApiOperation({
    summary: "Reschedule a respondent's administrative hearing.",
  })
  rescheduleHearing(
    @Param('hearingId', new ParseUUIDPipe())
    hearingId: string,
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @Body() dto: RescheduleHearingDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.administrativeHearingService.rescheduleHearing(
      hearingId,
      partyId,
      dto,
      user,
    );
  }

  @Put(
    'employee-relations/administrative-hearing/:hearingId/parties/:partyId/conduct',
  )
  @ApiOperation({
    summary: "Mark a respondent's administrative hearing as conducted.",
  })
  conductHearing(
    @Param('hearingId', new ParseUUIDPipe())
    hearingId: string,
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @Body() dto: ConductHearingDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.administrativeHearingService.conductHearing(
      hearingId,
      partyId,
      dto,
      user,
    );
  }

  // @Put(
  //   'employee-relations/administrative-hearing/:hearingId/hearing-minutes'
  // )
  // @ApiOperation({
  //   summary: "Record the minutes details during the hearing",
  // })
  // hearingMinutes(
  //   @Param('hearingId', new ParseUUIDPipe()) hearingId: string,
  //   @Body() dto: MinutesHearingDto,
  //   @SessionUser() user: RequestUser,
  // ) {
  //   return this.administrativeHearingService.hearingMinutes(hearingId, dto, user);
  // }
}
