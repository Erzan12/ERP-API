import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExtendedLeaveCasesService } from './extended-leave-cases.service';
import { Can } from 'src/utils/decorators/can.decorator';
import { ApiGetResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateExtendedLeaveRequestDto, CreateExtendedLeaveRequestWithDetailsDto } from './dto/extended-leave-request.dto';

@ApiTags('Human Resources - Time and Attendance Cases (Extended Leave Cases)')
@Controller({path:'hris', version: '2'})
export class ExtendedLeaveCasesController {
    constructor (private readonly extendedLeaveCasesService: ExtendedLeaveCasesService) {}
    
    @Get('time-and-attendance-cases/extended-leaves')
    @ApiOperation({ summary: 'List of all Extended Leave Request' })
    @ApiGetResponse('List of Extended Leave Cases')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getExtendedLeaves(
        @SessionUser() user: RequestUser,
        // @Query() dto: ExtendedLeave
    ) {
        return this.extendedLeaveCasesService.getExtendedLeaves(user)
    }

    @Get('time-and-attendance-cases/extended-leave/status-count')
    @ApiOperation({ summary: 'List of all Extended Leave Request status' })
    @ApiGetResponse('List of all Extended Leave Request stats')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getStatusCountActive(
        @SessionUser() user: RequestUser,
    ) {
        return this.extendedLeaveCasesService.statusCount(user);
    }

    @Get('time-and-attendance-cases/extended-leave/:extendedHrLeaveRequestId')
    @ApiOperation({ summary: 'Get a single Extended Leave Request' })
    @ApiGetResponse('Here is the Extended Leave Request')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getExtendedLeave(
        @SessionUser() user: RequestUser,
        @Param("extendedHrLeaveRequestId", new ParseUUIDPipe) extendedHrLeaveRequestId: string,
    ) {
        return this.extendedLeaveCasesService.getExtendedLeave(user, extendedHrLeaveRequestId)
    }

    @Post('time-and-attendance-cases/extended-leave/:extendedHrLeaveRequestId')
    @ApiBody({
        type: CreateExtendedLeaveRequestWithDetailsDto,
        description: 'Payload to create Extended Leave Request'
    })
    @ApiOperation({ summary: 'Create Extended Leave Request'})
    @ApiPostResponse('Extended Leave Request successfully created')
    @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
    createExtendedLeaveRequest(
        @SessionUser() user: RequestUser,
        @Param("extendedHrLeaveRequestId", new ParseUUIDPipe) extendedHrLeaveRequestId: string,
        @Body() dto: CreateExtendedLeaveRequestWithDetailsDto,
    ) {
        return this.extendedLeaveCasesService.createExtendedLeaveRequest(user, extendedHrLeaveRequestId, dto)
    }
}
