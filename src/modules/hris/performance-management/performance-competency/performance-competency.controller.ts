import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { PerformanceCompetencyService } from './performance-competency.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { Can } from 'src/utils/decorators/can.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { CreatePerformanceCompetencyDto, UpdatePerformanceCompetencyDto } from './dto/performance-competency.dto';

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

    @Put('performance-compentency/:competencyId')
    @ApiBody({
        type: UpdatePerformanceCompetencyDto,
        description: 'Payload to update Performance Competency',
    })
    @ApiOperation({ summary: 'Update a current Performance Competency Information' })
    @ApiPatchResponse('Performance Competency updated successfully')
    @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
    updateCompetency(
        @Param('competencyId', new ParseUUIDPipe()) competencyId: string,
        @SessionUser() user: RequestUser,
        @Body() dto: UpdatePerformanceCompetencyDto,
    ) {
        return this.performanceCompetencyService.updateCompetency(
            competencyId,
            user,
            dto,
        )
    }

    @Get('performance-competency/:competencyId')
    @ApiOperation({ summary: 'Get a single Performance Competency' })
    @ApiPatchResponse('Here is the Performance Competency')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getCompetency(
        @SessionUser() user: RequestUser,
        @Param('competencyId', new ParseUUIDPipe()) competencyId: string,
    ) {
        return this.performanceCompetencyService.getCompetency(
            user,
            competencyId
        )
    }
}
