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

  @Put(
    'employee-relations/administrative-hearing/:disciplinaryCaseId/parties/:partyId/reschedule',
  )
  @ApiOperation({
    summary: "Reschedule a respondent's administrative hearing.",
  })
  rescheduleHearing(
    @Param('disciplinaryCaseId', new ParseUUIDPipe())
    disciplinaryCaseId: string,
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @Body() dto: RescheduleHearingDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.administrativeHearingService.rescheduleHearing(
      disciplinaryCaseId,
      partyId,
      dto,
      user,
    );
  }

  @Put(
    'employee-relations/administrative-hearing/:disciplinaryCaseId/parties/:partyId/conduct',
  )
  @ApiOperation({
    summary: "Mark a respondent's administrative hearing as conducted.",
  })
  conductHearing(
    @Param('disciplinaryCaseId', new ParseUUIDPipe())
    disciplinaryCaseId: string,
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @Body() dto: RescheduleHearingDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.administrativeHearingService.conductHearing(
      disciplinaryCaseId,
      partyId,
      dto,
      user,
    );
  }
}
