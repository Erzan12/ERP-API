import { Body, Controller, Get, Post } from '@nestjs/common';
import { LeaveCasesService } from './leave_cases.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import { ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateLeaveRequestWithDetailsDto } from './dto/leave-case.dto';

@ApiTags('Human Resources - Time and Attendance Cases (Leave Cases)')
@Controller({path:'hris', version: '2'})
export class LeaveCasesController {
    constructor (private readonly leaveCasesService: LeaveCasesService) {}

    @Get('time-and-attendance-cases/leave-cases')
    @ApiOperation({ summary: 'List of all Leave Cases' })
    @ApiGetResponse('List of Leave Cases')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getLeaveCases(
        @SessionUser() user: RequestUser,
    ) {
        return this.leaveCasesService.getLeaveCases(user)
    }

    @Post('time-and-attendance-cases/leave-cases')
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
}
