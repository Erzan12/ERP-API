import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseUUIDPipe,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';

import {
  ACTION_READ,
  ACTION_UPDATE,
  EMPLOYEE_MASTERLIST,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';

import {
  RecruitmentPaginationDto,
  StatusCountDto,
} from 'src/utils/dtos/recruitment-pagination.dto';
import {
  CreateCareerPostingDto,
  UpdateCareerPostingDto,
} from './dto/career-posting.dto';

import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CareerPostingService } from './career-posting.service';

@ApiTags('Human Resources - Recruitment and Onboarding')
@Controller({ path: 'hris', version: '2' })
export class CareerPostingV2Controller {
  constructor(private readonly careerPostingService: CareerPostingService) {}

  @Get('recruitments')
  @ApiOperation({ summary: 'List of all job/career postings' })
  @ApiGetResponse('List of job/career postings')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getCareerPostings(
    @SessionUser() user: RequestUser,
    @Query() dto: RecruitmentPaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('status') status?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.careerPostingService.getCareerPostings(user, dto);
  }

  @Get('recruitments/status-count')
  @ApiOperation({ summary: 'List of all job/career postings status' })
  @ApiGetResponse('List of job/career postings status')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getStatusCountActive(
    @SessionUser() user: RequestUser,
    @Query() dto: StatusCountDto,
  ) {
    return this.careerPostingService.statusCount(user, dto);
  }

  @Get('recruitments/:recruitmentId')
  @ApiOperation({ summary: 'Get a Job/Career posting' })
  @ApiGetResponse('Get a job/career posting')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getCareerPosting(
    @Param('recruitmentId', new ParseUUIDPipe()) recruitmentId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.careerPostingService.getCareerPosting(recruitmentId, user);
  }

  @Post('recruitments')
  @ApiBody({
    type: CreateCareerPostingDto,
    description: 'Payload to create a job/careeer posting',
  })
  @ApiOperation({ summary: 'Job/Career posting' })
  @ApiPostResponse('Career posted successfully')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  createCareerPosting(
    @Body() dto: CreateCareerPostingDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.careerPostingService.createCareerPosting(dto, user);
  }

  @Put('recruitments/:recruitmentId')
  @ApiBody({
    type: UpdateCareerPostingDto,
    description: 'Payload to update career posting',
  })
  @ApiOperation({ summary: 'Update a current company information' })
  @ApiPatchResponse('Career Posting updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
  updateCareerPosting(
    @Param('recruitmentId', new ParseUUIDPipe()) recruitmentId: string,
    @Body() updateCareerPostingDto: UpdateCareerPostingDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.careerPostingService.updateCareerPosting(
      recruitmentId,
      updateCareerPostingDto,
      user,
    );
  }
}
