import { ApiProperty } from '@nestjs/swagger';
import { LeaveCompensation } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateLeaveRequestDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Employee UUID',
    description: 'The employee uuid PK',
  })
  employee_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Leave Category UUID',
    description: 'The employee uuid PK',
  })
  leave_category_id: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-04-10',
    description: 'Date start of employee leave request',
  })
  date_from: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-04-10',
    description: 'Date end of the employee leave request',
  })
  date_to: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2026-04-11',
    description: 'Date return of the employee after extended leave request',
  })
  return_date?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'I will go for vacation',
    description: 'The reason of employee leave request',
  })
  reason: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '09633263341',
    description: 'Telephone or cellphone number of employee',
  })
  contact_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Hotel California',
    description: 'The employee address while on leave',
  })
  address_on_leave: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'User UUID for reliver while on leave',
    description: 'The uuid of reliever user while employee is on leave',
  })
  reliever_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'User UUID for verifier of this leave request',
    description: 'The uuid of verifier user for this leave request',
  })
  verifier_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'User UUID for leave request approver',
    description: 'The uuid of approver user for this user leave request',
  })
  approver_id: string;
}

export class RecordLeaveDatesDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-04-10',
  })
  leave_date: string;

  // @IsUUID()
  // @IsNotEmpty()
  // @ApiProperty({
  //     example: 'Leave type/category UUID PK'
  // })
  // leave_type: string;

  @IsNotEmpty()
  @IsEnum(LeaveCompensation, {
    each: true,
    message: 'Leave Compensation must be with_pay or without_pay',
  })
  @ApiProperty({
    example: 'with_pay or without_pay',
    description: 'The Leave Compensation for this leave date',
  })
  leave_compensation: LeaveCompensation;

  @IsNumber()
  @ApiProperty({
    example: 1.0,
  })
  fraction: number;
}

export class CreateLeaveRequestWithDetailsDto {
  @ApiProperty({ type: () => CreateLeaveRequestDto })
  @ValidateNested()
  @Type(() => CreateLeaveRequestDto)
  leave_request: CreateLeaveRequestDto;

  @ApiProperty({ type: () => [RecordLeaveDatesDto] })
  @ValidateNested({ each: true })
  @Type(() => RecordLeaveDatesDto)
  leave_dates: RecordLeaveDatesDto[];
}

export class UpdateLeaveRequestDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'Leave Category UUID',
    description: 'The employee uuid PK',
  })
  leave_category_id?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2026-04-10',
    description: 'Date start of employee leave request',
  })
  date_from?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2026-04-10',
    description: 'Date end of the employee leave request',
  })
  date_to?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2026-04-11',
    description: 'Date return of the employee after extended leave request',
  })
  return_date?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'I will go for vacation',
    description: 'The reason of employee leave request',
  })
  reason?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '09633263341',
    description: 'Telephone or cellphone number of employee',
  })
  contact_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Hotel California',
    description: 'The employee address while on leave',
  })
  address_on_leave?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'User UUID for reliver while on leave',
    description: 'The uuid of reliever user while employee is on leave',
  })
  reliever_id?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'User UUID for verifier of this leave request',
    description: 'The uuid of verifier user for this leave request',
  })
  verifier_id?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'User UUID for leave request approver',
    description: 'The uuid of approver user for this user leave request',
  })
  approver_id?: string;
}

export class UpdateRecordLeaveDatesDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'PK UUID of existing Leave Request Date record',
    description:
      'The unique primary key ID of the specific leave date record (leave empty for new dates)',
  })
  id?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2026-04-10',
  })
  leave_date?: string;

  // @IsUUID()
  // @IsNotEmpty()
  // @ApiProperty({
  //     example: 'Leave type/category UUID PK'
  // })
  // leave_type: string;

  @IsOptional()
  @IsEnum(LeaveCompensation, {
    each: true,
    message: 'Leave Compensation must be with_pay or without_pay',
  })
  @ApiProperty({
    enum: LeaveCompensation,
    example: LeaveCompensation,
    description: 'The Leave Compensation for this leave date',
  })
  leave_compensation?: LeaveCompensation;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1.0,
  })
  fraction?: number;
}

export class UpdateLeaveRequestWithDetailsDto {
  @ApiProperty({ type: () => UpdateLeaveRequestDto })
  @ValidateNested()
  @Type(() => UpdateLeaveRequestDto)
  update_leave_request: UpdateLeaveRequestDto;

  @ApiProperty({ type: () => [UpdateRecordLeaveDatesDto] })
  @ValidateNested({ each: true })
  @Type(() => UpdateRecordLeaveDatesDto)
  update_leave_dates: UpdateRecordLeaveDatesDto[];
}
