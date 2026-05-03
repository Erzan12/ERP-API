import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HiringPipelineService,
  InterviewApplicantService,
} from './hiring-pipeline.service';
import { CreateApplicantDto, UpdateApplicantDto } from './dto/applicant.dto';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  EMPLOYEE_MASTERLIST,
} from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  RecruitmentPaginationDto,
  StatusCountDto,
} from 'src/utils/dtos/recruitment-pagination.dto';
import { BulkAssignInterviewDto } from './dto/bulk-assign-interviewer.dto';
import { AssessInterviewDto } from './dto/assess-interviewer.dto';

/**
 * Applicant CONTROLLER SECTION
 */

@ApiTags('Human Resources - Recruitment and Onboarding (Applicants)')
@Controller({ path: 'hris', version: '2' })
export class ApplicantsController {
  constructor(
    private readonly hiringPipelineService: HiringPipelineService,
    private readonly interviewApplicantService: InterviewApplicantService,
  ) {}

  @Get('applicants')
  @ApiOperation({ summary: 'List of all applicant posted' })
  @ApiGetResponse('List of employees')
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
    return this.hiringPipelineService.getApplicants(user, dto);
  }

  @Get('applicants/status-count')
  @ApiOperation({ summary: 'List of all Applicants status' })
  @ApiGetResponse('List of all Applicants status')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getStatusCountActive(
    @SessionUser() user: RequestUser,
    @Query() dto: StatusCountDto,
  ) {
    return this.hiringPipelineService.statusCount(user, dto);
  }

  @Get('applicants/:applicantId')
  @ApiOperation({ summary: 'Get a Applicant' })
  @ApiGetResponse('Get a Applicant')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getCareerPosting(
    @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.getApplicant(applicantId, user);
  }

  @Post('applicants')
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
    return this.hiringPipelineService.createApplicant(dto, user);
  }

  @Put('applicants/:applicationId')
  @ApiBody({
    type: UpdateApplicantDto,
    description: 'Payload to update career posting',
  })
  @ApiOperation({ summary: 'Update a current company information' })
  @ApiPatchResponse('Career Posting updated successfully')
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  updateCareerPosting(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() updateApplicantDto: UpdateApplicantDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.updateApplicant(
      applicationId,
      updateApplicantDto,
      user,
    );
  }
}

/**
 * SCREENING CONTROLLER SECTION
 */

// @ApiTags('Human Resources - Recruitment and Onboarding (Screening Applicant)')
// @Controller({ path: 'hris', version: '2' })
// export class ScreeningApplicantController {
//   constructor(private readonly screeningApplicantService: ScreeningApplicantService) {}

//   @Get('applicants/screening/:applicantId')
//   @ApiOperation({ summary: 'Screen an Applicant' })
//   @ApiGetResponse('Screen an Applicant')
//   @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
//   getScreenApplicant(
//     @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
//     @SessionUser() user: RequestUser,
//   ) {
//     return this.screeningApplicantService.screenApplicant(applicantId, user);
//   }
// }

/**
 * INTERVIEW CONTROLLER SECTION
 */

@ApiTags('Human Resources - Recruitment and Onboarding (Interview Applicant)')
@Controller({ path: 'hris', version: '2' })
export class InterviewApplicantController {
  constructor(
    private readonly interviewApplicantService: InterviewApplicantService,
  ) {}

  /**
   * PHASE 1: ASSIGNMENT
   * Creates the 3 interview slots (Initial, Second, Final)
   */
  @Post('applicants/interview/assign-interview-panel') // post for creation
  @ApiOperation({ summary: 'Assign the full interview panel to an applicant' })
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  assignInterviewer(
    @Body() dto: BulkAssignInterviewDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.interviewApplicantService.assignInterviewPanel(user, dto);
  }

  /**
   * PHASE 2: ASSESSMENT
   * Updates one specific interview slot with results and exam ratings
   */
  @Patch('applicants/interview/assess-interview/:interviewerId')
  @ApiOperation({ summary: 'Submit assessment for a specific interview stage' })
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  async assessInterview(
    @Param('interviewerId', new ParseUUIDPipe()) interviewerId: string,
    @Body() dto: AssessInterviewDto,
    @SessionUser() user: RequestUser,
  ) {
    // We pass the ID from the URL into the DTO or directly to the service
    return this.interviewApplicantService.assessInterviewPanel(user, {
      ...dto,
      interviewer_id: interviewerId,
    });
  }
}
