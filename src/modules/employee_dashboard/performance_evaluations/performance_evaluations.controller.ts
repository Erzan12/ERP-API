import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PerformanceEvaluationService } from './performance_evaluations.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  EMPLOYEE_DASHBOARD,
} from 'src/utils/constants/ability.constant';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  AcknowledgeEvaluationDto,
  SubmitEvaluationDto,
} from './dto/performance_evaluation.dto';

@ApiTags('Performance Evaluation')
@Controller({ path: 'employee-dashboard', version: '2' })
export class PerformanceEvaluationController {
  constructor(
    private readonly performanceEvaluationService: PerformanceEvaluationService,
  ) {}

  @Get('performance-evaluation/my-evaluations')
  @ApiOperation({ summary: 'List of current users personal evaluation' })
  @ApiGetResponse('List of my evaluations')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_DASHBOARD })
  getMyEvaluations(@SessionUser() user: RequestUser) {
    return this.performanceEvaluationService.getMyEvaluations(user);
  }

  @Get('performance-evaluation/to-be-evaluated')
  @ApiOperation({ summary: 'List of evaluations added to this employee/user' })
  @ApiGetResponse('List of to be evaluated')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_DASHBOARD })
  getToBeEvaluated(@SessionUser() user: RequestUser) {
    return this.performanceEvaluationService.getToBeEvaluated(user);
  }

  @Get('performance-evaluation/done-evaluated')
  @ApiOperation({ summary: 'List of evaluations completed by this evaluator' })
  @ApiGetResponse('List of done/finished evaluations')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_DASHBOARD })
  getDoneEvaluated(@SessionUser() user: RequestUser) {
    return this.performanceEvaluationService.getDoneEvaluated(user);
  }

  @Post('performance-evaluation/to-be-evaluated/:evaluationId/submit')
  @ApiOperation({ summary: 'Submit Employee Performance Evaluation' })
  @ApiPostResponse('Employee Performance Evaluation submitted')
  @Can({ action: ACTION_CREATE, subject: EMPLOYEE_DASHBOARD })
  submitEvaluation(
    @Param('evaluationId', new ParseUUIDPipe()) evaluationId: string,
    @SessionUser() user: RequestUser,
    @Body() dto: SubmitEvaluationDto,
  ) {
    return this.performanceEvaluationService.submit(evaluationId, user, dto);
  }

  @Put('performance-evaluation/:evaluationId')
  @ApiOperation({ summary: 'Employee to acknowledge evaluation' })
  @ApiPatchResponse('Employee acknowledge evaluation successfully')
  @Can({ action: ACTION_CREATE, subject: EMPLOYEE_DASHBOARD })
  acknowledgeEvaluation(
    @Param('evaluationId', new ParseUUIDPipe()) evaluationId: string,
    @SessionUser() user: RequestUser,
    @Body() dto: AcknowledgeEvaluationDto,
  ) {
    return this.performanceEvaluationService.acknowledge(
      user,
      evaluationId,
      dto,
    );
  }
}
