import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Session } from '@nestjs/common';
import { PerformanceEvaluationService } from './performance-evaluation.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { Can } from 'src/utils/decorators/can.decorator';
import { AcknowledgeEvaluationDto, SubmitEvaluationDto } from './dto/performance-evaluation.dto';

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

    @Post('performance-evaluation/to-be-evaluated/:evaluationId/submit')
    @ApiOperation({ summary: 'Submit Employee Performance Evaluation' })
    @ApiPostResponse('Employee Performance Evaluation submitted')
    @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
    submitEvaluation(
        @Param('evaluationId', new ParseUUIDPipe()) evaluationId: string,
        @SessionUser() user: RequestUser,
        @Body() dto: SubmitEvaluationDto,
    ) {
        return this.performanceEvaluationService.submitEvaluation(evaluationId, user, dto)
    }

    @Post('performance-evaluation/evaluation/:evaluationId/acknowledge')
    @ApiOperation({ summary: 'Employee to acknowledge evaluation' })
    @ApiPostResponse('Employee acknowledge evaluation successfully')
    @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
    acknowledgeEvaluation(
        @Param('evaluationId', new ParseUUIDPipe()) evaluationId: string,
        @SessionUser() user: RequestUser,
        @Body() dto: AcknowledgeEvaluationDto,
    ) {
        return this.performanceEvaluationService.acknowledgeEvaluation( user,evaluationId, dto)
    }
}
