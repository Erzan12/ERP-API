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
  // @Expose({ name: 'company' }) // maps "company" input field to this property
  @ApiProperty({
    name: 'company_id',
    example: 'PK uuid of company',
    description: 'Company of the employee',
  })
  // @Transform(({ value }) => {
  //   console.log('Transforming company:', value);
  //   if (value === 'abmci') return "b2b37d58-6d1b-4052-b8fd-1df9f00ce18a";
  //   if (value === 'abisc') return "287332eb-7bdd-42c0-8cd1-c2a57caf350e";
  //   if (value === 'svsc') return "fb89d73d-644e-4b81-b937-0d36e0ba9e3c";
  //   if (value === 'lmvc') return "c5fa1c2b-82a4-4d19-91c3-5fbeb9bfc4aa";
  //   throw new BadRequestException(
  //     `Invalid company value ${value}. Allowed values are "abmci", "svsc", "lmvc", "abisc"`,
  //   );
  // })
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
  // @Expose({ name: 'position' }) // maps "position" input fields to this property
  @ApiProperty({
    name: 'position_id',
    example: 'PK uuid of position',
    description: 'Position of the employee',
  })
  // @Transform(({ value }) => {
  //   console.log('Transforming position:', value);
  //   if (value === 'it manager') return "cd88a914-4484-41f5-bd2c-7dc8aae92826";
  //   if (value === 'hr clerk') return "c1544d98-79b2-4ecb-9a99-1ca8340598ba";
  //   if (value === 'hr manager') return "d98ddc82-8e6e-4269-978d-f6bb34f3b429";
  //   if (value === 'it staff') return "29a8b84a-b450-4deb-a56b-e4d8ebde0673";
  //   if (value === 'administrator') return "";
  //   throw new BadRequestException(
  //     `Invalid position value ${value}. Allowed values are "it manager", "administrator", "it staff", "hr manager", "hr staff"`,
  //   );
  // })
  position_id: string;

  @IsUUID()
  @IsNotEmpty()
  // @Expose({ name: 'division' })
  @ApiProperty({
    name: 'division_id',
    example: 'PK uuid of division',
    description: 'Division of the employee',
  })
  // @Transform(({ value }) => {
  //   console.log('Transforming division:', value);
  //   if (value === 'Asset Management') return "74a1a571-ed6b-4426-b2ee-893d3165e994";
  //   if (value === 'Corporate Services') return "233098f7-9f12-4faf-8131-2c3feb81698c";
  //   throw new BadRequestException(
  //     `Invalid division value ${value}. Allowed values are "Asset Management", "Corporate Services"`,
  //   );
  // })
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
  // @Transform(({ value }) => {
  //   console.log('Transforming employement_status:', value);
  //   if (value === 'regular') return "fbd0dc31-2fc4-4ced-952f-39eaec30477c";
  //   if (value === 'on leave') return "2208c735-cc93-40ac-af7f-02c601f14bdf";
  //   if (value === 'terminated') return "3fb69883-6838-4ff9-abfa-18ec3628cf71";
  //   if (value === 'resigned') return 4;
  //   if (value === 'probationary') return 5;
  //   throw new BadRequestException(
  //     `Invalid employment_status value ${value}. Allowed values are "regular", "on leave", "terminated", "resigned", "probitionary"`,
  //   );
  // })
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
