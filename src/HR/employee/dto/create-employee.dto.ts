import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsObject,
    IsDateString,
    IsString,
    IsDefined
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class CreateEmployeeDto {
    
    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'company' }) // maps "company" input field to this property
    @ApiProperty({ 
        name: 'company',
        example: 'abmci, svsc, lmvc, abisc ', 
        description: 'Company of the employee'
    })
    @Transform(({ value }) => {
        console.log('Transforming company:', value);
        if (value === 'abmci') return 1;
        if (value === 'svsc') return 2;
        if (value === 'lmvc') return 3;
        if (value === 'abisc') return 4;
        throw new BadRequestException(
            `Invalid company value ${value}. Allowed values are "abmci", "svsc", "lmvc", "abisc"`
        );
    })
    company_id: number;

    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'department' }) // maps "department" input fields to this property
    @ApiProperty({ 
        name: 'department',
        example: 'it department, hr department', 
        description: 'Department of the employee'
    })
    @Transform(({ value }) => {
        console.log('Transforming department:', value);
        if (value === 'hr department') return 1;
        if (value === 'it department') return 2;
        throw new BadRequestException(
            `Invalid department value ${value}. Allowed values are "it department", "hr department"`
        );
    })
    department_id: number;

    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'position' }) // maps "position" input fields to this property
    @ApiProperty({ 
        name: 'position',
        example: 'it manager, administrator, it staff, hr manager, hr clerk', 
        description: 'Position of the employee'
    })
    @Transform(({ value }) => {
        console.log('Transforming position:', value);
        if (value === 'it manager') return 1;
        if (value === 'administrator') return 2;
        if (value === 'it staff') return 3;
        if (value === 'hr manager') return 4;
        if (value === 'hr clerk') return 5;
        throw new BadRequestException(
            `Invalid position value ${value}. Allowed values are "it manager", "administrator", "it staff", "hr manager", "hr staff"`
        );
    })
    position_id: number;

    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'division'})
    @ApiProperty({ 
        name: 'division',
        example: 'Asset Management, Corporate Services',
        description: 'Division of the employee'
    })
    @Transform(({ value }) => {
        console.log('Transforming division:', value);
        if (value === 'Asset Management') return 1;
        if (value === 'Corporate Services') return 2;
        throw new BadRequestException(
            `Invalid division vlaue ${value}. Allowed values are "Asset Management", "Corporate Services"`
        );
    })
    division_id: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ 
        example: 21000, 
        description: 'The salary of the employee'
    })
    salary: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ 
        example: '2025-07-10', 
        description: 'Hired date of the employee'
    })
    hire_date: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ 
        example: 'Monthly', 
        description: 'Pay frequency of the employee salary'
    })
    pay_frequency: string;

    @IsInt()
    @IsNotEmpty()
    @IsDefined()
    @Expose({ name: 'employment_status' }) // maps employment status in api property
    @ApiProperty({ 
        name: 'employment_status', 
        example: 'regular, on Leave, terminated, resigned, probationary', 
        description: 'The status of employee if Probitionary, Regular, On Leave, Resigned, Terminated'
    })
    @Transform(({ value }) => {
        console.log('Transforming employement_status:', value);
        if (value === 'regular') return 1;
        if (value === 'on leave') return 2;
        if (value === 'terminated') return 3;
        if (value === 'resigned') return 4;
        if (value === 'probationary') return 5;
        throw new BadRequestException(
            `Invalid employment_status value ${value}. Allowed values are "regular", "on leave", "terminated", "resigned", "probitionary"`
        );
    })
    employment_status_id: number;
    
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ 
        example: 21000, 
        description: 'The equivalent amount of salary per month of the employee'
    })
    monthly_equivalent_salary: number;

    @IsOptional()
    @ApiProperty({ 
        example: "can be left out for now since its optional", 
        description: 'The archived date of this employee record'
    })
    archive_date: string;

    @IsOptional()
    @IsObject()
    @ApiProperty({ 
        example: "Hobbies, Personal Experiences, etc. can be left out for now since its optional", 
        description: 'Other personal data or details of the employee'
    })
    other_employee_data?: Record<string, any>;

    @IsInt()
    @IsOptional()
    @ApiProperty({ 
        example: "can be left out for now since its optional", 
        description: 'Rank of the employee in the company'
    })
    corporate_rank_id: number;
}