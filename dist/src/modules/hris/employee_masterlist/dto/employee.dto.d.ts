export declare class CreateEmployeeDto {
    company_id: string;
    department_id: string;
    position_id: string;
    division_id: string;
    salary: number;
    hire_date: string;
    pay_frequency: string;
    employment_status_id: string;
    monthly_equivalent_salary: number;
    archive_date?: string;
    other_employee_data?: Record<string, any>;
    corporate_rank_id?: number;
}
declare const UpdateEmployeeDto_base: import("@nestjs/common").Type<Partial<CreateEmployeeDto>>;
export declare class UpdateEmployeeDto extends UpdateEmployeeDto_base {
}
export {};
