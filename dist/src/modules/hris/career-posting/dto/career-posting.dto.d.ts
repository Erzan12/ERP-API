import { EmployeeType, EmploymentType } from 'src/utils/decorators/global.enums.decorator';
export declare class CreateCareerPostingDto {
    position_id: string;
    slots: number;
    department_id: string;
    employee_type: EmployeeType;
    employment_type: EmploymentType;
    user_location_id: string;
}
export declare class UpdateCareerPostingDto {
    position_id?: string;
    slots?: number;
    job_description?: string;
    department_id?: string;
    employee_type?: EmployeeType;
    isPublished: boolean;
    is_active: boolean;
    employment_type?: EmploymentType;
    user_location_id?: string;
}
