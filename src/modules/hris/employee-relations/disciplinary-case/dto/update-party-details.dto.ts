import { ApiProperty } from '@nestjs/swagger';
import { HrErActionType, HrErCaseLevel } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UpdateCasePartyActionDto {
  @IsEnum(HrErActionType)
  @IsOptional()
  @ApiProperty({
    enum: HrErActionType,
    example: HrErActionType.preventive_suspension,
  })
  action_type: HrErActionType;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2026-08-15T00:00:00.000Z',
    description: 'Start date of the preventive suspension',
  })
  effectivity_start: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2026-08-20T23:59:59.999Z',
    description: 'End date of the preventive suspension',
  })
  effectivity_end: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Preventive suspension pending investigation',
    required: false,
  })
  remarks?: string;
}

export class UpdateCasePartyDto {
  @IsEnum(HrErCaseLevel)
  @IsOptional()
  @ApiProperty({
    enum: HrErCaseLevel,
    required: false,
    description: 'Required when role is respondent',
  })
  level?: HrErCaseLevel;

  // Available for Respondent only
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @ApiProperty({
    type: [String],
    required: false,
    description: 'Committed offense IDs — required when role is respondent',
  })
  offense_ids?: string[];

  // Available for Respondent only
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @ApiProperty({
    type: [String],
    required: false,
    description:
      'Policy violated (violation) IDs — required when role is respondent',
  })
  violation_ids?: string[];

  // Available for Respondent only
  @ValidateNested()
  @Type(() => UpdateCasePartyActionDto)
  @IsOptional()
  @ApiProperty({
    type: UpdateCasePartyActionDto,
    required: false,
    description:
      'Preventive suspension action. Only available for respondents with major level.',
  })
  action?: UpdateCasePartyActionDto;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This employee is the respondent in the case.',
  })
  remarks?: string;
}
