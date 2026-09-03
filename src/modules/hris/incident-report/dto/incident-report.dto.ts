import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { SharedCreateCaseIntakePartydto } from './shared-create-case-intake-party.dto';

export class CreateIncidentReportDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  incident_location_id: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2026-08-20T09:00:00.000Z' })
  incident_date: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'The personnel jump off the vessel',
  })
  incident_narrative?: string;

  @ValidateNested({ each: true })
  @Type(() => SharedCreateCaseIntakePartydto)
  @ArrayMinSize(1)
  @ApiProperty({ type: [SharedCreateCaseIntakePartydto] })
  parties: SharedCreateCaseIntakePartydto[];

  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  @ApiProperty({ type: [String], description: 'Committed offense IDs' })
  offense_ids: string[];
}

export class UpdateIncidentReportDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  incident_location_id?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2026-08-20T09:00:00.000Z' })
  incident_date?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    example: 'The personnel jump off the vessel',
  })
  incident_narrative?: string;

  @ValidateNested({ each: true })
  @Type(() => SharedCreateCaseIntakePartydto)
  @ArrayMinSize(1)
  @ApiPropertyOptional({ type: [SharedCreateCaseIntakePartydto] })
  parties?: SharedCreateCaseIntakePartydto[];

  @IsUUID('4', { each: true })
  // @ArrayO()
  @ApiPropertyOptional({ type: [String], description: 'Committed offense IDs' })
  offense_ids?: string[];
}
