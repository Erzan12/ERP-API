import { CreateEmployeeWithDetailsDto, UpdateEmployeeWithDetailsDto } from './dto/employee-person.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { EmployeeService } from './employee.service';
export declare class EmployeeControllerV2 {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    getEmployees(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        employees: {
            person: {
                first_name: string;
                last_name: string;
                middle_name: string | null;
            };
            company: {
                name: string;
            };
            division: {
                name: string;
            };
            department: {
                name: string;
            };
            position: {
                name: string;
            };
            id: string;
            employee_id: string;
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
            employment_status: {
                label: string;
            };
        }[];
    }>;
    getEmployee(id: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        employee: {
            person: {
                id: string;
                created_at: Date;
                email: string | null;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
                first_name: string;
                last_name: string;
                middle_name: string | null;
                suffix: string | null;
                date_of_birth: Date;
                gender: string | null;
                contact_no: string | null;
                civil_status: string;
                home_address: string | null;
                city_provice: string | null;
                nationality: string | null;
                country: string | null;
                zip_code: string | null;
                emergency_contact_person: string | null;
                emergency_contact_number: string | null;
                anonymization_preferences: import("@prisma/client/runtime/client").JsonValue | null;
                other_person_data: import("@prisma/client/runtime/client").JsonValue | null;
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
            employee_id: string;
            department_id: string;
            created_at: Date;
            person_id: string;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            salary: import("@prisma/client-runtime-utils").Decimal;
            employment_status_id: string;
            company_id: string;
            position_id: string;
            division_id: string;
            hire_date: Date;
            pay_frequency: string;
            monthly_equivalent_salary: import("@prisma/client-runtime-utils").Decimal;
            archive_date: Date | null;
            other_employee_data: import("@prisma/client/runtime/client").JsonValue | null;
            corporate_rank_id: number | null;
        };
    }>;
    createEmployee(createDto: CreateEmployeeWithDetailsDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        employee: {
            id: string;
            employee_id: string;
            department_id: string;
            created_at: Date;
            person_id: string;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            salary: import("@prisma/client-runtime-utils").Decimal;
            employment_status_id: string;
            company_id: string;
            position_id: string;
            division_id: string;
            hire_date: Date;
            pay_frequency: string;
            monthly_equivalent_salary: import("@prisma/client-runtime-utils").Decimal;
            archive_date: Date | null;
            other_employee_data: import("@prisma/client/runtime/client").JsonValue | null;
            corporate_rank_id: number | null;
        };
        created_by_user: string;
    }>;
    updateEmployee(id: string, updateEmployeeWithDetailsDto: UpdateEmployeeWithDetailsDto, user: RequestUser): Promise<{
        employee: {
            id: string;
            employee_id: string;
            department_id: string;
            created_at: Date;
            person_id: string;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            salary: import("@prisma/client-runtime-utils").Decimal;
            employment_status_id: string;
            company_id: string;
            position_id: string;
            division_id: string;
            hire_date: Date;
            pay_frequency: string;
            monthly_equivalent_salary: import("@prisma/client-runtime-utils").Decimal;
            archive_date: Date | null;
            other_employee_data: import("@prisma/client/runtime/client").JsonValue | null;
            corporate_rank_id: number | null;
        } | null;
        person: {
            id: string;
            created_at: Date;
            email: string | null;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            first_name: string;
            last_name: string;
            middle_name: string | null;
            suffix: string | null;
            date_of_birth: Date;
            gender: string | null;
            contact_no: string | null;
            civil_status: string;
            home_address: string | null;
            city_provice: string | null;
            nationality: string | null;
            country: string | null;
            zip_code: string | null;
            emergency_contact_person: string | null;
            emergency_contact_number: string | null;
            anonymization_preferences: import("@prisma/client/runtime/client").JsonValue | null;
            other_person_data: import("@prisma/client/runtime/client").JsonValue | null;
        } | null;
    }>;
}
