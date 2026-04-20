import { Controller, Get, Param, ParseUUIDPipe, Session } from '@nestjs/common';
import { PerformanceEvaluationService } from './performance_evaluations.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { Can } from 'src/utils/decorators/can.decorator';

@ApiTags('Performance Evaluation')
@Controller({path: 'employee-dashboard', version: '2'})
export class PerformanceEvaluationController {
    constructor (private readonly performanceEvaluationService: PerformanceEvaluationService) {}

    @Get('performance-evaluation/my-evaluations')
    @ApiOperation({ summary: 'List of current users personal evaluation' })
    @ApiGetResponse('List of my evaluations')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getMyEvaluations(
        @SessionUser() user: RequestUser,
    ) {
        return this.performanceEvaluationService.getMyEvaluations(user)
    }

    @Get('performance-evaluation/to-be-evaluated')
    @ApiOperation({ summary: 'List of evaluations added to this employee/user' })
    @ApiGetResponse('List of to be evaluated')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getToBeEvaluated(
        @SessionUser() user: RequestUser,
    ) {
        return this.performanceEvaluationService.getToBeEvaluated(user)
    }
}
