import { DivisionService } from './division.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateDivisionDto, UpdateDivisionDto } from './dto/division.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
export declare class DivisionControllerV2 {
    private divisionService;
    constructor(divisionService: DivisionService);
    getDivisions(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        divisions: ({
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
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            division_head_id: string | null;
        })[];
    }>;
    getDivision(divisionId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        division: {
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
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            division_head_id: string | null;
        };
    }>;
    createDivision(createDivisionDto: CreateDivisionDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        created_by: {
            id: string;
            name: string;
            position: string;
        };
        division: {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            division_head_id: string | null;
        };
    }>;
    updateDivision(divisionId: string, updateDivisiionDto: UpdateDivisionDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        updateDivision: {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            division_head_id: string | null;
        };
        updated_by_user: string;
    }>;
}
