import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCaseDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Company UUID',
  })
  company_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Location of the incident',
  })
  incident_location?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'The assigned location',
  })
  assigned_location?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'The date of the incident',
  })
  incident_date?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'The date of the report',
  })
  report_date?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example:
      'Describe what happened, who was involved, where it happened and supporting circumstances',
  })
  incident_narrative?: string;
}
