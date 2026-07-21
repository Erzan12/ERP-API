import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { OvertimeCasesService } from './overtime-cases.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  OVERTIME_REQUEST,
} from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Can } from 'src/utils/decorators/can.decorator';
import { OvertimeCasesPaginationDto } from 'src/utils/dtos/overtime-cases-pagination.dto';
import { CreateOvertimeCaseDto } from './dto/overtime-case.dto';

@ApiTags('Human Resources - Time and Attendance Cases (Overtime Request)')
@Controller({ path: 'hris', version: '2' })
export class OvertimeCasesController {
  constructor(private readonly overtimeCasesService: OvertimeCasesService) {}

  @Get('time-and-attendance-cases/overtimes')
  @ApiOperation({ summary: 'List of Overtime Requests' })
  @ApiGetResponse('List of Overtime Requests')
  @Can({ action: ACTION_READ, subject: OVERTIME_REQUEST })
  getOvertimeRequest(
    @SessionUser() user: RequestUser,
    @Query() dto: OvertimeCasesPaginationDto,
  ) {
    return this.overtimeCasesService.getOvertimeCases(user, dto);
  }

  @Get('time-and-attendance-cases/overtimes/:overtimeRequestId')
  @ApiOperation({ summary: 'Get a single Overtime Request' })
  @ApiGetResponse('Here is the Overtime Request')
  @Can({ action: ACTION_READ, subject: OVERTIME_REQUEST })
  getOvertimeRequests(
    @SessionUser() user: RequestUser,
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
  ) {
    return this.overtimeCasesService.getOvertimeCase(user, overtimeRequestId);
  }

  @Post('time-and-attendance-cases/overtimes')
  @ApiBody({
    type: CreateOvertimeCaseDto,
    description: 'Payload to create Overtime Request',
  })
  @ApiOperation({ summary: 'Create a overtime request' })
  @ApiPostResponse('Overtime request successfully created')
  @Can({ action: ACTION_CREATE, subject: OVERTIME_REQUEST })
  createOvertimeRequest(
    @SessionUser() user: RequestUser,
    @Body() dto: CreateOvertimeCaseDto,
  ) {
    return this.overtimeCasesService.createOvertimeCase(user, dto);
  }
}
