import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Session } from '@nestjs/common';
import { RegularizationReviewsService } from './regularization_reviews.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateEvaluationDto } from './dto/evaluation.dto';
import { RegularizationReviewDto } from 'src/utils/dtos/regularization-pagination.dto';

@ApiTags('Human Resources - Performance Management (Regularization Reviews)')
@Controller({path:'regularization-reviews', version: '2'})
export class RegularizationReviewsController {
    constructor(private readonly regularizationService: RegularizationReviewsService) {}

    @Get('for_regularization')
    @ApiOperation({ summary: 'List of all employees for regularization' })
    @ApiGetResponse('List of for regularization employees')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getForRegularizaiton(
        @SessionUser() user: RequestUser,
    ) {
        return this.regularizationService.getForRegularization(user);
    }

    @Post()
    @ApiOperation({ summary: 'Create an Employee Evaluation for the first 3rd and 5th month' })
    @ApiPostResponse('Evaluation successfully created')
    @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
    createEvaluation(
        @SessionUser() user: RequestUser,
        @Body() dto: CreateEvaluationDto,
    ) {
        return this.regularizationService.createEvaluation(dto,user)
    }

    @Get(':employeeId')
    @ApiOperation({ summary: 'Get employee with evaluation' })
    @ApiGetResponse('Employee with evaluation')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getEvaluations(
        @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
        @SessionUser() user: RequestUser,
    ) {
        return this.regularizationService.getEmployeeEvaluations(employeeId, user);
    }

    @Get('')
    @ApiOperation({ summary: 'List of for evaluated employees' })
    @ApiGetResponse('List of evalauted employees')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getForEvaluation(
        @SessionUser() user: RequestUser,
        @Query() dto: RegularizationReviewDto 
    )   {
        return this.regularizationService.getEvaluations(user, dto)
    }

}
