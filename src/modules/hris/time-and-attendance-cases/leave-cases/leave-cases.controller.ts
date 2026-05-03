import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { LeaveCasesService } from '../leave-cases/leave-cases.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import { ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateLeaveRequestWithDetailsDto } from './dto/leave-case.dto';
import { LeaveRequestPaginationDto } from 'src/utils/dtos/leave-request.dto';

@ApiTags('Human Resources - Time and Attendance Cases (Leave Cases)')
@Controller({path:'hris', version: '2'})
export class LeaveCasesController {
    constructor (private readonly leaveCasesService: LeaveCasesService) {}

    @Get('time-and-attendance-cases/leaves')
    @ApiOperation({ summary: 'List of all Leave Cases' })
    @ApiGetResponse('List of Leave Cases')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getLeaveCases(
        @SessionUser() user: RequestUser,
        @Query() dto: LeaveRequestPaginationDto,
    ) {
        return this.leaveCasesService.getLeaveCases(user, dto)
    }

    @Get('time-and-attendance-cases/leaves/status-count')
    @ApiOperation({ summary: 'List of all Leave Request status' })
    @ApiGetResponse('List of all Leave Request stats')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getStatusCountActive(
        @SessionUser() user: RequestUser,
    ) {
        return this.leaveCasesService.statusCount(user);
    }

    @Post('time-and-attendance-cases/leave')
    @ApiBody({
        type: CreateLeaveRequestWithDetailsDto,
        description: 'Payload to create Leave Request'
    })
    @ApiOperation({ summary: 'Leave Request Creation' })
    @ApiPostResponse('Leave Request successfully created')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    createLeaveRequest(
        @Body() dto: CreateLeaveRequestWithDetailsDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.leaveCasesService.createLeaveCase(user, dto)
    }

    // LEAVE REQUEST WORKFLOW STATUS
    @Post('time-and-attendance-cases/leave/:hrLeaveRequestId/submit')
    @ApiOperation({ summary: 'Submit Leave Request' })
    @ApiPostResponse('Leave Request submitted')
    submitLeave(
        @Param('hrLeaveRequestId', new ParseUUIDPipe) hrLeaveRequestId: string,
        @SessionUser() user: RequestUser
    ) {
        return this.leaveCasesService.submitLeave(hrLeaveRequestId,user)
    }

    @Post('time-and-attendance-cases/leave-cases/:hrLeaveRequestId/verify')
    @ApiOperation({ summary: 'Verify Leave Request' })
    @ApiPostResponse('Leave Request verified')
    verifyLeave(
        @Param('hrLeaveRequestId', new ParseUUIDPipe) hrLeaveRequestId: string,
        @SessionUser() user: RequestUser
    ) {
        return this.leaveCasesService.verifyLeave(hrLeaveRequestId,user)
    }

    @Post('time-and-attendance-cases/leave/:hrLeaveRequestId/approve')
    @ApiOperation({ summary: 'Approve Leave Request' })
    @ApiPostResponse('Leave Request approved')
    approveLeave(
        @Param('hrLeaveRequestId', new ParseUUIDPipe) hrLeaveRequestId: string,
        @SessionUser() user: RequestUser
    ) {
        return this.leaveCasesService.approveLeave(hrLeaveRequestId,user)
    }

    @Post('time-and-attendance-cases/leave/:hrLeaveRequestId/process')
    @ApiOperation({ summary: 'Process Leave Request' })
    @ApiPostResponse('Leave Request processed')
    processLeave(
        @Param('hrLeaveRequestId', new ParseUUIDPipe) hrLeaveRequestId: string,
        @SessionUser() user: RequestUser
    ) {
        return this.leaveCasesService.processLeave(hrLeaveRequestId,user)
    }

    @Post('time-and-attendance-cases/leave/:hrLeaveRequestId/reject')
    @ApiOperation({ summary: 'Reject Leave Request' })
    @ApiPostResponse('Leave Request rejected')
    rejectLeave(
        @Param('hrLeaveRequestId', new ParseUUIDPipe) hrLeaveRequestId: string,
        @SessionUser() user: RequestUser
    ) {
        return this.leaveCasesService.rejectLeave(hrLeaveRequestId,user)
    }

    @Post('time-and-attendance-cases/leave/:hrLeaveRequestId/cancel')
    @ApiOperation({ summary: 'Cancel Leave Request' })
    @ApiPostResponse('Leave Request cancelled')
    cancelLeave(
        @Param('hrLeaveRequestId', new ParseUUIDPipe) hrLeaveRequestId: string,
        @SessionUser() user: RequestUser
    ) {
        return this.leaveCasesService.cancelLeave(hrLeaveRequestId,user)
    }
}
