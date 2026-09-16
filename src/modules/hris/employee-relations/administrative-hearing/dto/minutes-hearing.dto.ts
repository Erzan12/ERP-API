import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class MinutesHearingDto {
  //   @IsOptional()
  //   @IsString()
  //   @ApiProperty({ required: false })
  //   minutes_file_url?: string;

  @IsDateString()
  @ApiProperty({ example: '2026-09-01T09:00:00.000Z' })
  minutes_start_at: string;

  @IsDateString()
  @ApiProperty({ example: '2026-09-01T09:00:00.000Z' })
  minutes_end_at: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Respondent Statement during hearing',
  })
  respondent_statement?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Hr Officers remarks' })
  remarks?: string;
}
