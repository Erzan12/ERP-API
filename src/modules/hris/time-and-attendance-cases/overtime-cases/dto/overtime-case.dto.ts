import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateOvertimeCaseDto {
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
    example: 'Vessel UUID',
    description: 'The vessel uuid PK',
  })
  vessel_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Overtime Rate UUID',
    description: 'The overtime rate uuid PK',
  })
  overtime_rate_id: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-05-12',
    description: 'Date Overtime is filed',
  })
  date_filed: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-05-08',
    description: 'Date of the overtime happen',
  })
  overtime_date: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  @ApiProperty({
    example: '18:00:00',
    description: 'Overtime start time',
  })
  time_from?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  @ApiProperty({
    example: '22:00:00',
    description: 'Overtime end time',
  })
  time_to?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Reason of overtime',
    default: 'Reason of your overtime',
  })
  reason: string;
}
