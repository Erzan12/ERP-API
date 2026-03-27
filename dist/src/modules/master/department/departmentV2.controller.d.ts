import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { DepartmentService } from './department.service';
export declare class DepartmentControllerV2 {
    private departmentService;
    constructor(departmentService: DepartmentService);
    getDepartments(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        departments: ({
            division: {
                id: string;
                name: string;
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
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            division_id: string;
            sorting: number | null;
            department_head_id: string | null;
        })[];
    }>;
    getDepartment(departmentId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        department: {
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
            division_id: string;
            sorting: number | null;
            department_head_id: string | null;
        };
    }>;
    createDepartment(createDepartmentDto: CreateDepartmentDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        department: {
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
        created_by_user: string;
    }>;
    updateDepartment(departmentId: string, updateDeptDto: UpdateDepartmentDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        updatedDepartment: {
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
        updated_by_user: string;
    }>;
}
