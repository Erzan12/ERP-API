import { ApiProperty } from '@nestjs/swagger';
import { HrErHearingChannel } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ScheduleHearingDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Disciplinary Case UUID',
  })
  disciplinary_case_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Party UUID',
  })
  party_id: string;

  @IsDateString()
  @ApiProperty({ example: '2026-09-01T09:00:00.000Z' })
  scheduled_at: string;

  @IsEnum(HrErHearingChannel)
  @ApiProperty({ enum: HrErHearingChannel })
  channel: HrErHearingChannel;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Respondent remarks for admin hearing',
    required: false,
  })
  remarks?: string;
}

export class RescheduleHearingDto {
  @IsDateString()
  @ApiProperty({ example: '2026-09-01T09:00:00.000Z' })
  scheduled_at: string;

  @IsEnum(HrErHearingChannel)
  @ApiProperty({ enum: HrErHearingChannel })
  channel: HrErHearingChannel;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Respondent remarks for admin hearing',
    required: false,
  })
  remarks?: string;
}
