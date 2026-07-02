import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExtendedLeaveCasesService } from './extended-leave-cases.service';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ApiGetResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_APPROVE,
  ACTION_CANCEL,
  ACTION_CREATE,
  ACTION_PROCESS,
  ACTION_READ,
  ACTION_REJECT,
  ACTION_SUBMIT,
  ACTION_VERIFY,
  EXTENDED_LEAVE_REQUEST,
} from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateExtendedLeaveRequestWithDetailsDto } from './dto/extended-leave-request.dto';
import { LeaveRequestPaginationDto } from 'src/utils/dtos/leave-request-pagination.dto';

@ApiTags('Human Resources - Time and Attendance Cases (Extended Leave Cases)')
@Controller({ path: 'hris', version: '2' })
export class ExtendedLeaveCasesController {
  constructor(
    private readonly extendedLeaveCasesService: ExtendedLeaveCasesService,
  ) {}

  @Get('time-and-attendance-cases/extended-leaves')
  @ApiOperation({ summary: 'List of all Extended Leave Request' })
  @ApiGetResponse('List of Extended Leave Cases')
  @Can({ action: ACTION_READ, subject: EXTENDED_LEAVE_REQUEST })
  getExtendedLeaves(
    @SessionUser() user: RequestUser,
    @Query() dto: LeaveRequestPaginationDto,
  ) {
    return this.extendedLeaveCasesService.getExtendedLeaves(user, dto);
  }

  @Get('time-and-attendance-cases/extended-leave/status-count')
  @ApiOperation({ summary: 'List of all Extended Leave Request status' })
  @ApiGetResponse('List of all Extended Leave Request stats')
  @Can({ action: ACTION_READ, subject: EXTENDED_LEAVE_REQUEST })
  getStatusCountActive(@SessionUser() user: RequestUser) {
    return this.extendedLeaveCasesService.statusCount(user);
  }

  @Get('time-and-attendance-cases/extended-leave/:extendedHrLeaveRequestId')
  @ApiOperation({ summary: 'Get a single Extended Leave Request' })
  @ApiGetResponse('Here is the Extended Leave Request')
  @Can({ action: ACTION_READ, subject: EXTENDED_LEAVE_REQUEST })
  getExtendedLeave(
    @SessionUser() user: RequestUser,
    @Param('extendedHrLeaveRequestId', new ParseUUIDPipe())
    extendedHrLeaveRequestId: string,
  ) {
    return this.extendedLeaveCasesService.getExtendedLeave(
      user,
      extendedHrLeaveRequestId,
    );
  }

  @Post('time-and-attendance-cases/extended-leave/:extendedHrLeaveRequestId')
  @ApiBody({
    type: CreateExtendedLeaveRequestWithDetailsDto,
    description: 'Payload to create Extended Leave Request',
  })
  @ApiOperation({ summary: 'Create Extended Leave Request' })
  @ApiPostResponse('Extended Leave Request successfully created')
  @Can({ action: ACTION_CREATE, subject: EXTENDED_LEAVE_REQUEST })
  createExtendedLeaveRequest(
    @SessionUser() user: RequestUser,
    @Param('extendedHrLeaveRequestId', new ParseUUIDPipe())
    @Body()
    dto: CreateExtendedLeaveRequestWithDetailsDto,
  ) {
    return this.extendedLeaveCasesService.createExtendedLeaveRequest(user, dto);
  }

  // EXTENDED LEAVE REQUEST WORKFLOW STATUS
  @Post(
    'time-and-attendance-cases/extended-leave/:extendedHrLeaveRequestId/submit',
  )
  @ApiOperation({ summary: 'Submit Extended Leave Request' })
  @ApiPostResponse('Extended Leave Request submitted')
  @Can({ action: ACTION_SUBMIT, subject: EXTENDED_LEAVE_REQUEST })
  submitExtendedLeave(
    @Param('extendedHrLeaveRequestId', new ParseUUIDPipe())
    extendedHrLeaveRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.extendedLeaveCasesService.submitExtendedLeave(
      extendedHrLeaveRequestId,
      user,
    );
  }

  @Post(
    'time-and-attendance-cases/extended-leave/:extendedHrLeaveRequestId/verify',
  )
  @ApiOperation({ summary: 'Verify Leave Request' })
  @ApiPostResponse('Extended Leave Request verified')
  @Can({ action: ACTION_VERIFY, subject: EXTENDED_LEAVE_REQUEST })
  verifyExtendedLeave(
    @Param('extendedHrLeaveRequestId', new ParseUUIDPipe())
    extendedHrLeaveRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.extendedLeaveCasesService.verifyExtendedLeave(
      extendedHrLeaveRequestId,
      user,
    );
  }

  @Post(
    'time-and-attendance-cases/extended-leave/:extendedHrLeaveRequestId/approve',
  )
  @ApiOperation({ summary: 'Approve Extended Leave Request' })
  @ApiPostResponse('Extended Leave Request approved')
  @Can({ action: ACTION_APPROVE, subject: EXTENDED_LEAVE_REQUEST })
  approveExtendedLeave(
    @Param('extendedHrLeaveRequestId', new ParseUUIDPipe())
    extendedHrLeaveRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.extendedLeaveCasesService.approveExtendedLeave(
      extendedHrLeaveRequestId,
      user,
    );
  }

  @Post('time-and-attendance-cases/leave/:extendedHrLeaveRequestId/process')
  @ApiOperation({ summary: 'Process Extended Leave Request' })
  @ApiPostResponse('Extended Leave Request processed')
  @Can({ action: ACTION_PROCESS, subject: EXTENDED_LEAVE_REQUEST })
  processExtendedLeave(
    @Param('extendedHrLeaveRequestId', new ParseUUIDPipe())
    extendedHrLeaveRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.extendedLeaveCasesService.processExtendedLeave(
      extendedHrLeaveRequestId,
      user,
    );
  }

  @Post('time-and-attendance-cases/leave/:extendedHrLeaveRequestId/reject')
  @ApiOperation({ summary: 'Reject Extended Leave Request' })
  @ApiPostResponse('Extended Leave Request rejected')
  @Can({ action: ACTION_REJECT, subject: EXTENDED_LEAVE_REQUEST })
  rejectExtendedLeave(
    @Param('extendedHrLeaveRequestId', new ParseUUIDPipe())
    extendedHrLeaveRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.extendedLeaveCasesService.rejectExtendedLeave(
      extendedHrLeaveRequestId,
      user,
    );
  }

  @Post('time-and-attendance-cases/leave/:extendedHrLeaveRequestId/cancel')
  @ApiOperation({ summary: 'Cancel Extended Leave Request' })
  @ApiPostResponse('Extended Leave Request cancelled')
  @Can({ action: ACTION_CANCEL, subject: EXTENDED_LEAVE_REQUEST })
  cancelExtendedLeave(
    @Param('extendedHrLeaveRequestId', new ParseUUIDPipe())
    extendedHrLeaveRequestId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.extendedLeaveCasesService.cancelExtendedLeave(
      extendedHrLeaveRequestId,
      user,
    );
  }
}
