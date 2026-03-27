import { CreateCareerPostingDto, UpdateCareerPostingDto } from './dto/career-posting.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RecruitmentPaginationDto, StatusCountDto } from 'src/utils/dtos/recruitment-pagination.dto';
export declare class CareerPostingService {
    private prisma;
    constructor(prisma: PrismaService);
    getCareerPosting(recruitmentId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        recruitment: {
            department: {
                id: string;
                name: string;
            };
            position: {
                id: string;
                name: string;
                job_description: string | null;
            };
            createdBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
            updatedBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
            user_location: {
                id: string;
                country: string | null;
                location_name: string;
                city: string | null;
                province: string | null;
            };
        } & {
            id: string;
            department_id: string;
            created_at: Date;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            position_id: string;
            job_description: string | null;
            status: import(".prisma/client").$Enums.CareerPosingStatus;
            slots: number;
            employee_type: string;
            employment_type: string;
            user_location_id: string;
            isPublished: boolean;
            published_on: Date | null;
        };
    }>;
    getCareerPostings(user: RequestUser, dto: RecruitmentPaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        recruitments: {
            department: {
                id: string;
                name: string;
            };
            position: {
                id: string;
                name: string;
                job_description: string | null;
            };
            id: string;
            created_at: Date;
            is_active: boolean;
            updated_at: Date;
            createdBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
            updatedBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
            job_description: string | null;
            status: import(".prisma/client").$Enums.CareerPosingStatus;
            slots: number;
            employee_type: string;
            employment_type: string;
            isPublished: boolean;
            published_on: Date | null;
            user_location: {
                id: string;
                country: string | null;
                location_name: string;
                city: string | null;
                province: string | null;
            };
        }[];
    }>;
    createCareerPosting(createCareerPosting: CreateCareerPostingDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        recruitment: {
            id: string;
            department_id: string;
            created_at: Date;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            position_id: string;
            job_description: string | null;
            status: import(".prisma/client").$Enums.CareerPosingStatus;
            slots: number;
            employee_type: string;
            employment_type: string;
            user_location_id: string;
            isPublished: boolean;
            published_on: Date | null;
        };
        created_by_user: string;
    }>;
    updateCareerPosting(recruitmentId: string, updateCareerPostingDto: UpdateCareerPostingDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        recruitment: {
            id: string;
            department_id: string;
            created_at: Date;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            position_id: string;
            job_description: string | null;
            status: import(".prisma/client").$Enums.CareerPosingStatus;
            slots: number;
            employee_type: string;
            employment_type: string;
            user_location_id: string;
            isPublished: boolean;
            published_on: Date | null;
        };
        updated_by_user: string;
    }>;
    statusCount(user: RequestUser, dto: StatusCountDto): Promise<{
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
}
