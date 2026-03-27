import { HiringPipelineService, InterviewApplicantService } from './hiring-pipeline.service';
import { CreateApplicantDto, UpdateApplicantDto } from './dto/applicant.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { RecruitmentPaginationDto, StatusCountDto } from 'src/utils/dtos/recruitment-pagination.dto';
import { BulkAssignInterviewDto } from './dto/bulk-assign-interviewer.dto';
import { AssessInterviewDto } from './dto/assess-interviewer.dto';
export declare class ApplicantsController {
    private readonly hiringPipelineService;
    private readonly interviewApplicantService;
    constructor(hiringPipelineService: HiringPipelineService, interviewApplicantService: InterviewApplicantService);
    getCareerPostings(user: RequestUser, dto: RecruitmentPaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        applicants: {
            id: string;
            email: string;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            createdBy: {
                person: {
                    first_name: string;
                    middle_name: string | null;
                    last_name: string;
                };
            } | null;
            updatedBy: {
                person: {
                    first_name: string;
                    middle_name: string | null;
                    last_name: string;
                };
            } | null;
            first_name: string;
            middle_name: string | null;
            last_name: string;
            mobile_number: string;
            application_source: import(".prisma/client").$Enums.ApplicationSource;
            application_status: import(".prisma/client").$Enums.ApplicationStatus;
            date_applied: Date;
            careerPosting: {
                id: string;
                position: {
                    name: string;
                };
                user_location: {
                    id: string;
                    location_name: string;
                    city: string | null;
                    province: string | null;
                    country: string | null;
                };
            };
        }[];
    }>;
    getStatusCountActive(user: RequestUser, dto: StatusCountDto): Promise<{
        stauts: string;
        message: string;
        result: {
            all: number;
            draft: number;
            submitted: number;
            verified: number;
            approved: number;
            rejected: number;
        };
    }>;
    getCareerPosting(applicantId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        applicant: {
            createdBy: {
                person: {
                    first_name: string;
                    middle_name: string | null;
                    last_name: string;
                };
            } | null;
            updatedBy: {
                person: {
                    first_name: string;
                    middle_name: string | null;
                    last_name: string;
                };
            } | null;
            careerPosting: {
                id: string;
                position: {
                    name: string;
                };
                user_location: {
                    id: string;
                    location_name: string;
                    city: string | null;
                    province: string | null;
                    country: string | null;
                };
            };
        } & {
            id: string;
            email: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            created_at: Date;
            updated_at: Date;
            career_id: string;
            first_name: string;
            middle_name: string | null;
            last_name: string;
            mobile_number: string;
            application_source: import(".prisma/client").$Enums.ApplicationSource;
            application_status: import(".prisma/client").$Enums.ApplicationStatus;
            date_applied: Date;
        };
    }>;
    createApplicant(dto: CreateApplicantDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        applicant: {
            id: string;
            email: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            created_at: Date;
            updated_at: Date;
            career_id: string;
            first_name: string;
            middle_name: string | null;
            last_name: string;
            mobile_number: string;
            application_source: import(".prisma/client").$Enums.ApplicationSource;
            application_status: import(".prisma/client").$Enums.ApplicationStatus;
            date_applied: Date;
        };
        created_by_user: string;
    }>;
    updateCareerPosting(applicationId: string, updateApplicantDto: UpdateApplicantDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        applicant: {
            id: string;
            email: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            created_at: Date;
            updated_at: Date;
            career_id: string;
            first_name: string;
            middle_name: string | null;
            last_name: string;
            mobile_number: string;
            application_source: import(".prisma/client").$Enums.ApplicationSource;
            application_status: import(".prisma/client").$Enums.ApplicationStatus;
            date_applied: Date;
        };
        updated_by_user: string;
    }>;
}
export declare class InterviewApplicantController {
    private readonly interviewApplicantService;
    constructor(interviewApplicantService: InterviewApplicantService);
    assignInterviewer(dto: BulkAssignInterviewDto, user: RequestUser): Promise<import(".prisma/client").Prisma.BatchPayload>;
    assessInterview(interviewerId: string, dto: AssessInterviewDto, user: RequestUser): Promise<{
        id: string;
        employee_id: string;
        created_by: string | null;
        updated_by: string | null;
        created_at: Date;
        updated_at: Date;
        applicant_id: string;
        date_of_interview: Date | null;
        stage: import(".prisma/client").$Enums.InterviewStage;
        remarks: string | null;
        total_points: number | null;
        recommendations: string | null;
    }>;
}
