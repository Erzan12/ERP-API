import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HiringPipelineService } from '../hiring-pipeline.service';
import { CreateApplicantDto } from '../dto/applicant.dto';
import { ApiGetResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Can } from 'src/utils/decorators/can.decorator';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

@ApiTags('Human Resources - Recruitment and Onboarding')
@Controller({path: 'hris', version: '2'})
export class HiringPipelineV2Controller {
    constructor(private readonly hiringPipelineService: HiringPipelineService) {}

    @Get('hiring-pipeline')
    @ApiOperation({ summary: 'List of all job/career postings' })
    @ApiGetResponse('List of employees')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getCareerPostings(
        @SessionUser() user: RequestUser,
        @Query() dto: PaginationDto,
        @Query('page') page = 1,
        @Query('perPage') perPage = 10,
        @Query('search') search?: string,
        @Query('sortBy') sortBy: string = 'created_at',
        @Query('order') order: 'asc' | 'desc' = 'asc',
    ) {
    return this.hiringPipelineService.getApplicants(user,dto);
    }

    @Post('hiring-pipeline')
    @ApiBody({
        type: CreateApplicantDto,
        description: 'Payload to create Applicant',
    })
    @ApiOperation({ summary: 'Applicant posting' })
    @ApiPostResponse('Applicant posted successfully')
    @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
    createApplicant(
        @Body() dto: CreateApplicantDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.hiringPipelineService.createApplicant(dto,user)
    }
}
