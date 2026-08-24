import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HrErExplanationChannel } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SubmitExplainationDto {
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
