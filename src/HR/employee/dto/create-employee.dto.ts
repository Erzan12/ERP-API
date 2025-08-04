import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsObject,
    IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
    
    @IsInt()
    @IsNotEmpty()
    company_id: number;

    @IsInt()
    @IsNotEmpty()
    department_id: number;

    @IsInt()
    @IsNotEmpty()
    position_id: number;

    @IsInt()
    @IsNotEmpty()
    division_id: number;

    @IsInt()
    @IsNotEmpty()
    salary: number;
    
    @IsDateString()
    @Type(() => Date)
    hire_date: Date;

    @IsNotEmpty()
    pay_frequency: string;

    @IsNotEmpty()
    employment_status_id: number;
    
    @IsInt()
    @IsNotEmpty()
    monthly_equivalent_salary: number;

    @IsOptional()
    archive_date: string;

    @IsOptional()
    @IsObject()
    other_employee_data?: Record<string, any>;

    @IsInt()
    @IsNotEmpty()
    corporate_rank_id: number;
}