import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsDateString,
  IsString,
  IsDefined,
  IsUUID,
} from 'class-validator';
// import { Expose, Transform } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
// import { BadRequestException } from '@nestjs/common';

export class CreateEmployeeDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    name: 'company_id',
    example: 'PK uuid of company',
    description: 'Company of the employee',
  })
  company_id: string;

  @IsUUID()
  @IsNotEmpty()
  // @Expose({ name: 'department' }) // maps "department" input fields to this property
  @ApiProperty({
    name: 'department_id',
    example: 'PK uuid of department',
    description: 'Department of the employee',
  })
  // @Transform(({ value }) => {
  //   console.log('Transforming department:', value);
  //   if (value === 'hr department') return "ddc33ca7-6088-4368-9c95-86f4b30e3cfd";
  //   if (value === 'it department') return "4c0647c8-2b00-49dd-8a82-deee685dd95d";
  //   throw new BadRequestException(
  //     `Invalid department value ${value}. Allowed values are "it department", "hr department"`,
  //   );
  // })
  department_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    name: 'position_id',
    example: 'PK uuid of position',
    description: 'Position of the employee',
  })
  position_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    name: 'division_id',
    example: 'PK uuid of division',
    description: 'Division of the employee',
  })
  division_id: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 21000,
    description: 'The salary of the employee',
  })
  salary: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-07-10',
    description: 'Hired date of the employee',
  })
  hire_date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Monthly',
    description: 'Pay frequency of the employee salary',
  })
  pay_frequency: string;

  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  // @Expose({ name: 'employment_status' }) // maps employment status in api property
  @ApiProperty({
    name: 'employment_status_id',
    example: 'PK uuid of employment status',
    description:
      'The status of employee if Probitionary, Regular, On Leave, Resigned, Terminated',
  })
  employment_status_id: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 21000,
    description: 'The equivalent amount of salary per month of the employee',
  })
  monthly_equivalent_salary: number;

  @IsOptional()
  @ApiProperty({
    example: 'can be left out for now since its optional',
    description: 'The archived date of this employee record',
  })
  archive_date?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    example:
      'Hobbies, Personal Experiences, etc. can be left out for now since its optional',
    description: 'Other personal data or details of the employee',
  })
  other_employee_data?: Record<string, any>;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 'can be left out for now since its optional',
    description: 'Rank of the employee in the company',
  })
  corporate_rank_id?: number;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
