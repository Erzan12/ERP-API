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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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
} from 'src/utils/dtos/recruitment-pagination.dto';
import { BulkAssignInterviewDto } from './dto/bulk-assign-interviewer.dto';
import { AssessInterviewDto } from './dto/assess-interviewer.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  ) {
    return this.hiringPipelineService.statusCount(user);
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
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '').replace(/\s+/g, '-');

          cb(null, `${name}-${timestamp}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        career_id: { type: 'string'},

        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },

        mobile_number: { type: 'string' },

        date_applied:{ type: 'string' },

        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },

        application_source: { 
          type: 'string',
          enum: [
            'company_website',
            'walk_in',
            'referral',
            'linkedIn',
            'jobstreet'
          ]
        },

        // document_type: {
        //   type: 'array',
        //   items: {
        //     type: 'string',
        //     enum: [
        //       'resume',
        //       'cover_letter',
        //       'portfolio',
        //       'certificate',
        //       'other',
        //     ],
        //   },
        // },
      },
    },
  })
  @ApiOperation({ summary: 'Applicant posting' })
  @ApiPostResponse('Applicant posted successfully')
  @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
  createApplicant(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateApplicantDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.createApplicant(dto, user, files );
  }

  @Put('applicants/:applicationId')
  @ApiBody({
    type: UpdateApplicantDto,
    description: 'Payload to update career posting',
  })
  @ApiOperation({ summary: 'Update a current applicants information' })
  @ApiPatchResponse('Career Posting updated successfully')
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  updateCareerPosting(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() dto: UpdateApplicantDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.updateApplicant(
      applicationId,
      dto,
      user,
    );
  }

  // HIRING PIPELINE WORKFLOW STATUS
  @Post('applicants/:applicantId/submit')
  @ApiOperation({ summary: 'Shortlist an Applicant' })
  @ApiPostResponse('Applicant has been shortlisted')
  submitLeave(
      @Param('applicantId', new ParseUUIDPipe) applicantId: string,
      @SessionUser() user: RequestUser
  ) {
      return this.hiringPipelineService.shortlisted(applicantId,user)
  }

  @Post('applicants/:applicantId/for-interview')
  @ApiOperation({ summary: 'Set an Applicant for Interview' })
  @ApiPostResponse('Applicant has been set for interview')
  forInterview(
      @Param('applicantId', new ParseUUIDPipe) applicantId: string,
      @SessionUser() user: RequestUser
  ) {
      return this.hiringPipelineService.forInterview(applicantId,user)
  }

  @Post('applicants/:applicantId/accept')
  @ApiOperation({ summary: 'Accept an Applicant' })
  @ApiPostResponse('Applicant has been accepted')
  accept(
    @Param('applicantId', new ParseUUIDPipe) applicantId: string,
    @SessionUser() user: RequestUser
  ) {
    return this.hiringPipelineService.accepted(applicantId, user)
  }

  @Post('applicants/:applicantId/onboard')
  @ApiOperation({ summary: 'Onbaord an Applicant' })
  @ApiPostResponse('Applicant is now onboard')
  onBoard(
    @Param('applicantId', new ParseUUIDPipe) applicantId: string,
    @SessionUser() user: RequestUser
  ) {
    return this.hiringPipelineService.onBoarding(applicantId, user)
  }

  @Post('applicants/:applicantId/reject')
  @ApiOperation({ summary: 'Reject an Applicant' })
  @ApiPostResponse('Applicant has been rejected')
  reject(
    @Param('applicantId', new ParseUUIDPipe) applicantId: string,
    @SessionUser() user: RequestUser
  ) {
    return this.hiringPipelineService.reject(applicantId, user)
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
