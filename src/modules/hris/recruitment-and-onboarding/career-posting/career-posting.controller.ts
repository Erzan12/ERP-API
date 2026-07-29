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
  ACTION_APPROVE,
  ACTION_CREATE,
  ACTION_READ,
  ACTION_REJECT,
  ACTION_SUBMIT,
  ACTION_UPDATE,
  ACTION_VERIFY,
  CAREER_POSTING,
} from 'src/utils/constants/ability.constant';

import { RecruitmentPaginationDto } from 'src/utils/dtos/recruitment-pagination.dto';
import {
  CreateCareerPostingDto,
  UpdateCareerPostingDto,
} from './dto/career-posting.dto';

import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CareerPostingService } from './career-posting.service';

@ApiTags('Human Resources - Recruitment and Onboarding (Job/Career Posting)')
@Controller({ path: 'hris', version: '2' })
export class CareerPostingController {
  constructor(private readonly careerPostingService: CareerPostingService) {}

  @Get('recruitments')
  @ApiOperation({ summary: 'List of all job/career postings' })
  @ApiGetResponse('List of job/career postings')
  @Can({ action: ACTION_READ, subject: CAREER_POSTING })
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
  @Can({ action: ACTION_READ, subject: CAREER_POSTING })
  getStatusCountActive(
    @SessionUser() user: RequestUser,
    // @Query() dto: StatusCountDto,
  ) {
    return this.careerPostingService.statusCount(user);
  }

  @Get('recruitments/:recruitmentId')
  @ApiOperation({ summary: 'Get a Job/Career posting' })
  @ApiGetResponse('Get a job/career posting')
  @Can({ action: ACTION_READ, subject: CAREER_POSTING })
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
  @Can({ action: ACTION_CREATE, subject: CAREER_POSTING })
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
  @Can({ action: ACTION_UPDATE, subject: CAREER_POSTING })
  updateCareerPosting(
    @Param('recruitmentId', new ParseUUIDPipe()) recruitmentId: string,
    @Body() dto: UpdateCareerPostingDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.careerPostingService.updateCareerPosting(
      recruitmentId,
      dto,
      user,
    );
  }

  // CAREER/JOB POSTING WORKFLOW STATUS
  @Put('recruitments/:recruitmentId/submit')
  @ApiOperation({ summary: 'Submit Career/Job Posting' })
  @ApiPatchResponse('Career/Job Posting submitted')
  @Can({ action: ACTION_SUBMIT, subject: CAREER_POSTING })
  submitCareerPosting(
    @Param('recruitmentId', new ParseUUIDPipe()) recruitmentId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.careerPostingService.submit(recruitmentId, user);
  }

  @Put('recruitments/:recruitmentId/verify')
  @ApiOperation({ summary: 'Verify Career/Job Posting' })
  @ApiPatchResponse('Career/Job Posting verified')
  @Can({ action: ACTION_VERIFY, subject: CAREER_POSTING })
  verifyCareerPosting(
    @Param('recruitmentId', new ParseUUIDPipe()) recruitmentId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.careerPostingService.verify(recruitmentId, user);
  }

  @Put('recruitments/:recruitmentId/approve')
  @ApiOperation({ summary: 'Approve Career/Job Posting' })
  @ApiPatchResponse('Career/Job Posting approved')
  @Can({ action: ACTION_APPROVE, subject: CAREER_POSTING })
  approveCareerPosting(
    @Param('recruitmentId', new ParseUUIDPipe()) recruitmentId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.careerPostingService.approve(recruitmentId, user);
  }

  @Put('recruitments/:recruitmentId/reject')
  @ApiOperation({ summary: 'Reject Career/Job Posting' })
  @ApiPatchResponse('Career/Job Posting rejected')
  @Can({ action: ACTION_REJECT, subject: CAREER_POSTING })
  rejectCareerPosting(
    @Param('recruitmentId', new ParseUUIDPipe()) recruitmentId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.careerPostingService.reject(recruitmentId, user);
  }
}
