import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
  ACTION_ACCEPT,
  ACTION_CREATE,
  ACTION_ONBOARD,
  ACTION_READ,
  ACTION_REJECT,
  ACTION_SUBMIT,
  ACTION_UPDATE,
  HIRING_PIPELINE,
  INTERVIEW_APPLICANT,
  SCREENING_APPLICANT,
} from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Can } from 'src/utils/decorators/can.decorator';
import { RecruitmentPaginationDto } from 'src/utils/dtos/recruitment-pagination.dto';
import { BulkAssignInterviewDto } from './dto/bulk-assign-interviewer.dto';
import { AssessInterviewDto } from './dto/assess-interviewer.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

/**
 * Applicant CONTROLLER SECTION
 */

@ApiTags('Human Resources - Recruitment and Onboarding (Applicants)')
@Controller({ path: 'hris', version: '2' })
export class ApplicantsController {
  constructor(private readonly hiringPipelineService: HiringPipelineService) {}

  @Get('applicants')
  @ApiOperation({ summary: 'List of all applicant posted' })
  @ApiGetResponse('List of employees')
  @Can({ action: ACTION_READ, subject: HIRING_PIPELINE })
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
  @Can({ action: ACTION_READ, subject: HIRING_PIPELINE })
  getStatusCountActive(@SessionUser() user: RequestUser) {
    return this.hiringPipelineService.statusCount(user);
  }

  @Get('applicants/:applicantId')
  @ApiOperation({ summary: 'Get a Applicant' })
  @ApiGetResponse('Get a Applicant')
  @Can({ action: ACTION_READ, subject: HIRING_PIPELINE })
  getCareerPosting(
    @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.getApplicant(applicantId, user);
  }

  @Get('applicants/:applicantId/documents')
  @ApiOperation({ summary: 'Get Applicant document' })
  @ApiGetResponse('Get Applicant document')
  @Can({ action: ACTION_READ, subject: HIRING_PIPELINE })
  getApplicantDocuments(
    @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.getApplicantDocuments(
      applicantId,
      user,
    );
  }

  @Post('applicants')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      // storage: diskStorage({
      //   destination: './uploads',
      //   filename: (req, file, cb) => {
      //     const timestamp = Date.now();
      //     const ext = extname(file.originalname);
      //     const name = file.originalname.replace(ext, '').replace(/\s+/g, '-');

      //     cb(null, `${name}-${timestamp}${ext}`);
      //   },
      // }),
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        career_id: { type: 'string' },

        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },

        mobile_number: { type: 'string' },

        date_applied: { type: 'string' },

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
            'jobstreet',
          ],
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
  @Can({ action: ACTION_CREATE, subject: HIRING_PIPELINE })
  createApplicant(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateApplicantDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.createApplicant(dto, user, files);
  }

  @Put('applicants/:applicantId')
  @ApiBody({
    type: UpdateApplicantDto,
    description: 'Payload to update career posting',
  })
  @ApiOperation({ summary: 'Update a current applicants information' })
  @ApiPatchResponse('Career Posting updated successfully')
  @Can({ action: ACTION_UPDATE, subject: HIRING_PIPELINE })
  updateCareerPosting(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateApplicantDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.updateApplicant(
      applicationId,
      dto,
      user,
      files,
    );
  }

  // HIRING PIPELINE WORKFLOW STATUS
  @Put('applicants/:applicantId/shortlist')
  @ApiOperation({ summary: 'Shortlist an Applicant' })
  @ApiPatchResponse('Applicant has been shortlisted')
  @Can({ action: ACTION_SUBMIT, subject: HIRING_PIPELINE })
  submitLeave(
    @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.screenApplicant(applicantId, user);
  }

  @Put('applicants/:applicantId/for-interview')
  @ApiOperation({ summary: 'Set an Applicant for Interview' })
  @ApiPatchResponse('Applicant has been set for interview')
  @Can({ action: ACTION_SUBMIT, subject: HIRING_PIPELINE })
  forInterview(
    @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.forInterview(applicantId, user);
  }

  @Put('applicants/:applicantId/accept')
  @ApiOperation({ summary: 'Accept an Applicant' })
  @ApiPatchResponse('Applicant has been accepted')
  @Can({ action: ACTION_ACCEPT, subject: HIRING_PIPELINE })
  accept(
    @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.accepted(applicantId, user);
  }

  @Put('applicants/:applicantId/onboard')
  @ApiOperation({ summary: 'Onbaord an Applicant' })
  @ApiPatchResponse('Applicant is now onboard')
  @Can({ action: ACTION_ONBOARD, subject: HIRING_PIPELINE })
  onBoard(
    @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.onBoarding(applicantId, user);
  }

  @Put('applicants/:applicantId/reject')
  @ApiOperation({ summary: 'Reject an Applicant' })
  @ApiPatchResponse('Applicant has been rejected')
  @Can({ action: ACTION_REJECT, subject: HIRING_PIPELINE })
  reject(
    @Param('applicantId', new ParseUUIDPipe()) applicantId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.hiringPipelineService.reject(applicantId, user);
  }
}

/**
 * SCREENING CONTROLLER SECTION
 */

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
  @ApiPostResponse('Applicant has been assign to an interview panel')
  @Can({ action: ACTION_UPDATE, subject: INTERVIEW_APPLICANT })
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
  @Put('applicants/interview/assess-interview/:interviewerId')
  @ApiOperation({ summary: 'Submit assessment for a specific interview stage' })
  @ApiPatchResponse('Assess applicant interview')
  @Can({ action: ACTION_UPDATE, subject: INTERVIEW_APPLICANT })
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
