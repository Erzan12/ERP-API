import { Body, Controller, Get, Post } from '@nestjs/common';
import { PerformanceCompetencyService } from './performance_competency.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { Can } from 'src/utils/decorators/can.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { CreatePerformanceCompetencyDto } from './dto/performance_comtency.dto';

@ApiTags('Human Resources - Performance Management (Performance Competencies)')
@Controller({path: 'hris', version: '2'})
export class PerformanceCompetencyController {
    constructor (private readonly performanceCompetencyService: PerformanceCompetencyService) {}

    @Get('performance-competency')
    @ApiOperation({ summary: 'List of all Performance Competencies' })
    @ApiGetResponse('List of Performance Comptencies')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getCompetencies(
        @SessionUser() user: RequestUser,
    ) {
        return this.performanceCompetencyService.getCompetencies(user)
    }

    @Post('performance-competency')
    @ApiOperation({ summary: 'Create a Performance Competency' })
    @ApiPostResponse('Performance Competency created')
    @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
    createCompetency(
        @SessionUser() user: RequestUser,
        @Body() dto: CreatePerformanceCompetencyDto
    ) {
        return this.performanceCompetencyService.createCompetencies(user, dto)
    }
}
