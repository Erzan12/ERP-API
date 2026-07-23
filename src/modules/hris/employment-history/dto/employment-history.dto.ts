import { ApiProperty } from '@nestjs/swagger';
import { EmploymentHistory } from '@prisma/client';
// import { Type } from 'class-transformer';
import {
  IsDateString,
  // IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ResolveEmploymentHistoryDto {
  type: EmploymentHistory;
  previous_id?: string;
  current_id?: string;
}

export class CreateEmploymentHistoryDto {
  // @IsUUID()
  // @IsNotEmpty()
  // @ApiProperty({
  //     name: 'employee_id',
  //     example: 'PK uuid of employee',
  //     description: 'Employee PK ID',
  // })
  // employee_id: string;

  // @IsNotEmpty()
  // @IsEnum(EmploymentHistoryType, {
  //   message:
  //     'Valid employment history type: company, division, department, section, sub_section, position, salary_grade, employment_status, vessel, employee_location, development_assignment',
  // })
  // @Type(() => String)
  // @ApiProperty({
  //   enum: EmploymentHistoryType,
  //   required: true,
  // })
  // type: EmploymentHistoryType;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    // name: 'Current pk uuid e.g employee_id, company_id, division_id, department_id, position_id, salary_grade etc.',
    example: 'PK uuid of employee',
    description: 'Employee PK ID',
  })
  current_id: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-07-10',
    description: 'Effectivity date of this employee movement',
  })
  effectivity_date: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Your remarks to this employee movement',
  })
  remarks?: string;
}
