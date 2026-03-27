import { EmploymentStatusService } from './employment_status.service';
import { CreateEmployeeStatusDto, UpdateEmployeeStatusDto } from './dto/employee-status.dto';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
export declare class EmploymentStatusControllerV2 {
    private employmentStatusService;
    constructor(employmentStatusService: EmploymentStatusService);
    getEmployeeStats(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        employmentStatus: ({
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
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            code: string;
            label: string;
        })[];
    }>;
    getEmployeeStat(employeeStatusId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        employeeStat: {
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
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            code: string;
            label: string;
        };
    }>;
    createEmployeeStatus(createEmpStat: CreateEmployeeStatusDto, user: RequestUser): Promise<{
        status: string;
        mesage: string;
        employeeStatus: {
            id: string;
            created_at: Date;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            code: string;
            label: string;
        };
        created_by_user: string;
    }>;
    updateEmployeeStatus(employeeStatusId: string, updateEmployeeStatusDto: UpdateEmployeeStatusDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        updatedEmployeeStatus: {
            id: string;
            created_at: Date;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            code: string;
            label: string;
        };
        updated_by_user: string;
    }>;
}
