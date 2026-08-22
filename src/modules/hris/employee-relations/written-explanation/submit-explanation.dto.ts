import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HrErExplanationChannel } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SubmitExplainationDto {
  @IsEnum(HrErExplanationChannel)
  @ApiProperty({ enum: HrErExplanationChannel })
  channel: HrErExplanationChannel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    required: false,
    example:
      'I acknowledge receiving the instruction and have provided the circusmtances surrounding the incident.',
  })
  response_text?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    required: false,
    description: 'URL of the uploaded written explanation file',
  })
  file_url?: string;
}
