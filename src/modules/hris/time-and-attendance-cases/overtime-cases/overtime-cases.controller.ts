import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OvertimeCasesService } from './overtime-cases.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_APPROVE,
  ACTION_CANCEL,
  ACTION_CREATE,
  ACTION_READ,
  ACTION_REJECT,
  ACTION_SUBMIT,
  ACTION_UPDATE,
  ACTION_VERIFY,
  OVERTIME_REQUEST,
} from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Can } from 'src/utils/decorators/can.decorator';
import { OvertimeRequestsPaginationDto } from 'src/utils/dtos/overtime-request-pagination.dto';
import {
  CreateOvertimeRequestDto,
  UpdateOvertimeRequestDto,
} from './dto/overtime-case.dto';
import { OvertimeStatus } from '@prisma/client';

@ApiTags('Human Resources - Time and Attendance Cases (Overtime Request)')
@Controller({ path: 'hris', version: '2' })
export class OvertimeCasesController {
  constructor(private readonly overtimeCasesService: OvertimeCasesService) {}

  @Get('time-and-attendance-cases/overtimes')
  @ApiOperation({ summary: 'List of Overtime Requests' })
  @ApiGetResponse('List of Overtime Requests')
  @ApiQuery({
    name: 'show_by_status',
    required: false,
    isArray: true,
    enum: OvertimeStatus,
    style: 'form',
    explode: false,
  })
  @Can({ action: ACTION_READ, subject: OVERTIME_REQUEST })
  getOvertimeRequest(
    @SessionUser() user: RequestUser,
    @Query() dto: OvertimeRequestsPaginationDto,
  ) {
    return this.overtimeCasesService.getOvertimeRequests(user, dto);
  }

  // @Get('time-and-attendance-cases/overtimes/statuses')
  // @ApiOperation({ summary: 'List of Overtime Request based on Statuses' })
  // @ApiGetResponse('List of Overtime Request based on Statuses')
  // @ApiQuery({
  //   name: 'show_by_status',
  //   required: false,
  //   isArray: true,
  //   enum: OvertimeStatus,
  //   style: 'form',
  //   explode: false,
  // })
  // @Can({ action: ACTION_READ, subject: OVERTIME_REQUEST })
  // getOvertimeRequestStatuses(
  //   // @SessionUser() user: RequestUser,
  //   // @Query() dto: OvertimeRequestsPaginationDto,
  //   @Query() dto: OvertimeRequestStatusPaginationDto,
  // ) {
  //   return this.overtimeCasesService.getOvertimeRequestWithStatuses(dto);
  // }

  @Get('time-and-attendance-cases/overtimes/:overtimeRequestId')
  @ApiOperation({ summary: 'Get a single Overtime Request' })
  @ApiGetResponse('Here is the Overtime Request')
  @Can({ action: ACTION_READ, subject: OVERTIME_REQUEST })
  getOvertimeRequests(
    @SessionUser() user: RequestUser,
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
  ) {
    return this.overtimeCasesService.getOvertimeRequest(
      user,
      overtimeRequestId,
    );
  }

  @Post('time-and-attendance-cases/overtimes')
  @ApiBody({
    type: CreateOvertimeRequestDto,
    description: 'Payload to create Overtime Request',
  })
  @ApiOperation({ summary: 'Create a overtime request' })
  @ApiPostResponse('Overtime request successfully created')
  @Can({ action: ACTION_CREATE, subject: OVERTIME_REQUEST })
  createOvertimeRequest(
    @SessionUser() user: RequestUser,
    @Body() dto: CreateOvertimeRequestDto,
  ) {
    return this.overtimeCasesService.createOvertimeRequest(user, dto);
  }

  @Put('time-and-attendance-cases/overtimes/:overtimeRequestId')
  @ApiBody({
    type: UpdateOvertimeRequestDto,
    description: 'Payload to update Overtime Request',
  })
  @ApiOperation({ summary: 'Update a overtime request' })
  @ApiPostResponse('Overtime Request updated successfully')
  @Can({ action: ACTION_UPDATE, subject: OVERTIME_REQUEST })
  updateOvertimeRequest(
    @SessionUser() user: RequestUser,
    @Body() dto: UpdateOvertimeRequestDto,
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
  ) {
    return this.overtimeCasesService.updateOvertimeRequest(
      user,
      dto,
      overtimeRequestId,
    );
  }

  // OVERTIME REQUEST WORKFLOW STATUS
  @Put('time-and-attendance-cases/overtimes/:overtimeRequestId/submit')
  @ApiOperation({ summary: 'Submit Overtime Request' })
  @ApiPatchResponse('Overtime Request submitted')
  @Can({ action: ACTION_SUBMIT, subject: OVERTIME_REQUEST })
  submitOvertimeRequest(
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.overtimeCasesService.submitOvertimeRequest(
      overtimeRequestId,
      user,
    );
  }

  @Put('time-and-attendance-cases/overtimes/:overtimeRequestId/verify')
  @ApiOperation({ summary: 'Verify Overtime Request' })
  @ApiPatchResponse('Overtime Request verified')
  @Can({ action: ACTION_VERIFY, subject: OVERTIME_REQUEST })
  verifyOvertimeRequest(
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.overtimeCasesService.verifyOvertimeRequest(
      overtimeRequestId,
      user,
    );
  }

  @Put('time-and-attendance-cases/overtimes/:overtimeRequestId/approve')
  @ApiOperation({ summary: 'Approve Overtime Request' })
  @ApiPatchResponse('Overtime Request approved')
  @Can({ action: ACTION_APPROVE, subject: OVERTIME_REQUEST })
  approveOvertimeRequest(
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.overtimeCasesService.approveOvertimeRequest(
      overtimeRequestId,
      user,
    );
  }

  @Put('time-and-attendance-cases/overtimes/:overtimeRequestId/processed')
  @ApiOperation({ summary: 'Process Overtime Request' })
  @ApiPatchResponse('Overtime Request processed')
  @Can({ action: ACTION_APPROVE, subject: OVERTIME_REQUEST })
  processOvertimeRequest(
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.overtimeCasesService.processeOvertimeRequest(
      overtimeRequestId,
      user,
    );
  }

  @Put('time-and-attendance-cases/overtimes/:overtimeRequestId/reject')
  @ApiOperation({ summary: 'Reject Overtime Request' })
  @ApiPatchResponse('Overtime Request rejected')
  @Can({ action: ACTION_REJECT, subject: OVERTIME_REQUEST })
  rejectOvertimeRequest(
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.overtimeCasesService.rejectOvertimeRequest(
      overtimeRequestId,
      user,
    );
  }

  @Put('time-and-attendance-cases/overtimes/:overtimeRequestId/cancel')
  @ApiOperation({ summary: 'Cancel Overtime Request' })
  @ApiPatchResponse('Overtime Request cancelled')
  @Can({ action: ACTION_CANCEL, subject: OVERTIME_REQUEST })
  cancelOvertimeRequest(
    @Param('overtimeRequestId', new ParseUUIDPipe()) overtimeRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.overtimeCasesService.cancelOvertimeRequest(
      overtimeRequestId,
      user,
    );
  }
}
