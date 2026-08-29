import {
  ArrayMinSize,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HrErActionType, HrErCaseLevel } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConvertIntakePartyActionDto {
  @IsEnum(HrErActionType)
  @IsNotEmpty()
  @ApiProperty({
    enum: HrErActionType,
    example: HrErActionType.preventive_suspension,
  })
  action_type: HrErActionType;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-08-15T00:00:00.000Z',
    description: 'Start date of the preventive suspension',
  })
  effectivity_start: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-08-20T23:59:59:999Z',
    description: 'End date of the preventive suspension',
  })
  effectivity_end: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Preventive suspension pending investigation',
    required: false,
  })
  remarks?: string;
}

export class ConvertIntakePartyDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Employee UUID',
  })
  employee_id: string;

  @IsEnum(HrErCaseLevel)
  @ApiPropertyOptional({
    enum: HrErCaseLevel,
    required: false,
    description: 'Required when role is respondent',
  })
  @IsOptional()
  level: HrErCaseLevel;

  // // Available for Respondent only
  // @ValidateIf((o) => o.role === HrErCasePartyRole.respondent)
  // @IsArray()
  // @ArrayMinSize(1)
  // @IsUUID(undefined, { each: true })
  // @ApiProperty({
  //   type: [String],
  //   required: false,
  //   description: 'Committed offense IDs — required when role is respondent',
  // })
  // offense_ids?: string[];

  // // Available for Respondent only
  // @ValidateIf((o) => o.role === HrErCasePartyRole.respondent)
  // @IsArray()
  // @ArrayMinSize(1)
  // @IsUUID(undefined, { each: true })
  // @ApiProperty({
  //   type: [String],
  //   required: false,
  //   description:
  //     'Policy violated (violation) IDs — required when role is respondent',
  // })
  // violation_ids?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ConvertIntakePartyActionDto)
  action?: ConvertIntakePartyActionDto;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This employee is the respondent in the case.',
  })
  remarks?: string;
}

export class ConvertIntakeToCaseDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'e5f6a7b8-c9d0-1234-ef56-789012345678',
    description:
      'If converting a Case Intake/Report into this Disciplinary Case, its UUID',
    required: false,
  })
  intake_id?: string; // when converting

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'Company UUID',
  })
  company_id?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  incident_location_id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'The assigned location',
  })
  assigned_location?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'The date of the incident',
  })
  incident_date: string;

  // @IsOptional()
  // @IsEnum(HrErIntakeType)
  // type?: HrErIntakeType; // overrides intake.type if provided

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   example: 'What kind of suspicious activity or accident happened',
  // })
  // subject?: string; // overrides intake.subject if provided

  @IsDateString()
  @ApiProperty({
    example: 'The date of the report',
  })
  @IsNotEmpty()
  report_date: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'Describe what happened, who was involved, where it happened and supporting circumstances',
  })
  incident_narrative: string;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ConvertIntakePartyDto)
  @ApiProperty({
    type: [ConvertIntakePartyDto],
    description:
      'Employees involved in the case. A respondent requires level, offense_ids, and violation_ids.',
    example: [
      {
        employee_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        level: 'major',
        offense_ids: [
          '11111111-1111-1111-1111-111111111111',
          '22222222-2222-2222-2222-222222222222',
        ],
        violation_ids: [
          '33333333-3333-3333-3333-333333333333',
          '44444444-4444-4444-4444-444444444444',
        ],
        action: {
          action_type: 'preventive_suspension',
          effectivity_start: '2026-08-15T00:00:00.000Z',
          effectivity_end: '2026-08-20T23:59:59.999Z',
          remarks: 'Preventive suspension pending investigation.',
        },
        remarks: 'This employee is the respondent in the case.',
      },
      {
        employee_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        remarks: 'Employee who reported the incident.',
      },
      {
        employee_id: 'c3d4e5f6-a7b8-9012-cdef-234567890123',
        remarks: 'Employee who witnessed the incident.',
      },
    ],
  })
  parties: ConvertIntakePartyDto[];
}
