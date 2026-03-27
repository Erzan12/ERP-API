import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
export declare class PositionService {
    private prisma;
    constructor(prisma: PrismaService);
    getPosition(positionId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        position: {
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
        } & {
            id: string;
            department_id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            sorting: number | null;
            job_description: string | null;
            hierarchy: string | null;
        };
    }>;
    getPositions(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        positions: ({
            department: {
                division: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                created_at: Date;
                name: string;
                is_active: boolean;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
                division_id: string;
                sorting: number | null;
                department_head_id: string | null;
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
        } & {
            id: string;
            department_id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            sorting: number | null;
            job_description: string | null;
            hierarchy: string | null;
        })[];
    }>;
    createPosition(createPositionDto: CreatePositionDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        position: {
            department: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            department_id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            sorting: number | null;
            job_description: string | null;
            hierarchy: string | null;
        };
        created_by_user: string;
    }>;
    updatePosition(positionId: string, updatePositionDto: UpdatePositionDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        position: {
            id: string;
            department_id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            sorting: number | null;
            job_description: string | null;
            hierarchy: string | null;
        };
        updated_by_user: string;
    }>;
}
