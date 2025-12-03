import {
 IsInt,
 IsOptional,
 IsString,
 IsEnum,
 IsDateString,
 MinLength,
 IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CivilStatus, Gender } from 'src/Components/decorators/global.enums.decorator';

export class UpdateEmployeeDto {

    @IsOptional()
    @IsInt()
    company_id: number;

    @IsOptional()
    @IsInt()
    department_id?: number;

    @IsOptional()
    @IsInt()
    position_id?: number;

    @IsOptional()
    salary?: number;

    @IsOptional()
    @IsDateString()
    hire_date?: string;

    @IsOptional()
    @IsString()
    pay_frequency: string;

    @IsInt()
    @IsOptional()
    employment_status_id: number;

    @IsInt()
    @IsOptional()
    monthly_equivalent_salary: number;

    @IsOptional()
    @IsString()
    archive_date: string;

    @IsOptional()
    @IsObject()
    other_employee_data: string;

    @IsOptional()
    @IsInt()
    corporate_rank_id: number;
}