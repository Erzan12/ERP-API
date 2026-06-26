import { ApiProperty } from '@nestjs/swagger';
import { LeaveCompensation, LeaveRequestStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateExtendedLeaveRequestDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Leave Request UUID',
    description: 'The leave request uuid PK',
  })
  leave_request_id: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-04-10',
    description: 'Date start of employee extended leave request',
  })
  extension_date_from: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-04-10',
    description: 'Date end of the employee extended leave request',
  })
  extension_date_to: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-04-11',
    description: 'Date return of the employee after extended leave request',
  })
  return_date?: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @IsEnum(LeaveRequestStatus, {
    each: true,
    message:
      'Extended Leave Request status must be draft, for_verification, for_approval, for_processing, processed, cancelled, rejected',
  })
  @ApiProperty({
    enum: LeaveRequestStatus,
    example: LeaveRequestStatus,
    description: 'The status of Extended Leave Request',
  })
  extended_leave_request_status: LeaveRequestStatus;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'I will go for vacation',
    description: 'The reason of employee leave request',
  })
  reason_for_extension: string;

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
    example: 'User UUID for verifier of this extended leave request',
    description: 'The uuid of verifier user for this extended leave request',
  })
  verifier_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'User UUID for extended leave request approver',
    description: 'The uuid of approver user for this extended leave request',
  })
  approver_id: string;
}

export class RecordExtendedLeaveDatesDto {
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
  @IsNotEmpty()
  @IsEnum(LeaveCompensation, {
    each: true,
    message: 'Leave Compensation must be with_pay or without_pay',
  })
  @ApiProperty({
    enum: LeaveCompensation,
    example: LeaveCompensation,
    description: 'The Leave Compensation for this leave date',
  })
  leave_compensation: LeaveCompensation;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1.0,
  })
  fraction: number;
}

export class CreateExtendedLeaveRequestWithDetailsDto {
  @ApiProperty({ type: () => CreateExtendedLeaveRequestDto })
  @ValidateNested()
  @Type(() => CreateExtendedLeaveRequestDto)
  extended_leave_request: CreateExtendedLeaveRequestDto;

  @ApiProperty({ type: () => [RecordExtendedLeaveDatesDto] })
  @ValidateNested({ each: true })
  @Type(() => RecordExtendedLeaveDatesDto)
  extended_leave_dates: RecordExtendedLeaveDatesDto[];
}
