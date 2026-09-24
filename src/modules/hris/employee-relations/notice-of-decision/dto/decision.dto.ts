import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HrErDecisionType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

const DATED_DECISION_TYPES: HrErDecisionType[] = [
  HrErDecisionType.acquitted,
  HrErDecisionType.stern_warning,
  HrErDecisionType.written_reprimand,
  HrErDecisionType.suspension_7d,
  HrErDecisionType.suspension_15d,
  HrErDecisionType.rehabilitation,
  HrErDecisionType.dismissal,
];

export class CreateDecisionDto {
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

  @IsEnum(HrErDecisionType)
  @ApiProperty({ enum: HrErDecisionType })
  decision_type: HrErDecisionType;

  @ValidateIf((o: CreateDecisionDto) =>
    DATED_DECISION_TYPES.includes(o.decision_type),
  )
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: '2026-09-01T09:00:00.000Z',
    description: 'Required for suspension/rehabilitation decisions',
  })
  effectivity_start?: string;

  @ValidateIf((o: CreateDecisionDto) =>
    DATED_DECISION_TYPES.includes(o.decision_type),
  )
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: '2026-09-05T09:00:00.000Z',
    description: 'Required for suspension/rehabilitation decisions',
  })
  effectivity_end?: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   required: false,
  //   description: 'URL of the signed Notice of Decision',
  // })
  // signed_file_url?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  remarks?: string;
}

export class UpdateDecisionDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Disciplinary Case UUID',
  })
  disciplinary_case_id?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Party UUID',
  })
  party_id?: string;

  @IsEnum(HrErDecisionType)
  @IsOptional()
  @ApiPropertyOptional({ enum: HrErDecisionType })
  decision_type?: HrErDecisionType;

  @ValidateIf((o: CreateDecisionDto) =>
    DATED_DECISION_TYPES.includes(o.decision_type),
  )
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    example: '2026-09-0109:00:00.000Z',
    description: 'Required for suspension/rehabilitation decisions',
  })
  effectivity_start?: string;

  @ValidateIf((o: CreateDecisionDto) =>
    DATED_DECISION_TYPES.includes(o.decision_type),
  )
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    example: '2026-09-0109:00:00.000Z',
    description: 'Required for suspension/rehabilitation decisions',
  })
  effectivity_end?: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   required: false,
  //   description: 'URL of the signed Notice of Decision',
  // })
  // signed_file_url?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ required: false })
  remarks?: string;
}
