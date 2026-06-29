import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { OvertimeCasesService } from './overtime-cases.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_READ,
  SYSTEM_MANAGEMENT,
} from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Can } from 'src/utils/decorators/can.decorator';
import { OvertimeCasesPaginationDto } from 'src/utils/dtos/overtime-cases-pagination.dto';

@ApiTags('Human Resources - Time and Attendance Cases (Overtime Request)')
@Controller({ path: 'hris', version: '2' })
export class OvertimeCasesController {
  constructor(private readonly overtimeCasesService: OvertimeCasesService) {}

  @Get('time-and-attendance-cases/overtimes')
  @ApiOperation({ summary: 'List of Overtime Requests' })
  @ApiGetResponse('List of Overtime Requests')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
  getOvertimeRequest(
    @SessionUser() user: RequestUser,
    @Query() dto: OvertimeCasesPaginationDto,
  ) {
    return this.overtimeCasesService.getOvertimeCases(user, dto);
  }

  @Get('time-and-attendance-cases/overtimes/:overtimeRequestId')
  @ApiOperation({ summary: 'Get a single Overtime Request' })
  @ApiGetResponse('Here is the Overtime Request')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
  getOvertimeRequests(
    @SessionUser() user: RequestUser,
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
  ) {
    return this.overtimeCasesService.getOvertimeCase(user, overtimeRequestId);
  }
}
