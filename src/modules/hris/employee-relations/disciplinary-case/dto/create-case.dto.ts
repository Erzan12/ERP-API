import { ApiProperty } from '@nestjs/swagger';
import {
  HrErActionType,
  HrErCaseLevel,
  HrErCasePartyRole,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  registerDecorator,
  ValidateIf,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';

export function HasRespondent(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'hasRespondent',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(parties: CreateCasePartyDto[]) {
          return (
            Array.isArray(parties) &&
            parties.some((p) => p.role === 'respondent')
          );
        },
        defaultMessage() {
          return 'At least one party must be tagged as respondent.';
        },
      },
    });
  };
}

export function getStageTiming(
  party: { stage_started_at: Date | null },
  slaDays: number,
) {
  if (!party.stage_started_at) return null;
  const daysInStage = Math.floor(
    (Date.now() - party.stage_started_at.getTime()) / 86_400_000,
  );
  return {
    daysInStage,
    slaDays,
    isOverdue: daysInStage > slaDays,
  };
}

export class CreateCasePartyActionDto {
  @IsEnum(HrErActionType)
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

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Preventive suspension pending investigation',
    required: false,
  })
  remarks?: string;
}

export class CreateCasePartyDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Employee UUID',
  })
  employee_id: string;

  @IsEnum(HrErCasePartyRole)
  @ApiProperty({
    enum: HrErCasePartyRole,
    example: HrErCasePartyRole.respondent,
  })
  role: HrErCasePartyRole;

  // respondent-only from here down — validated conditionally below
  @ValidateIf(
    (o: CreateCasePartyDto) => o.role === HrErCasePartyRole.respondent,
  )
  @IsEnum(HrErCaseLevel)
  @ApiProperty({
    enum: HrErCaseLevel,
    required: false,
    description: 'Required when role is respondent',
  })
  level?: HrErCaseLevel;

  // Available for Respondent only
  @ValidateIf(
    (o: CreateCasePartyDto) => o.role === HrErCasePartyRole.respondent,
  )
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    type: [String],
    required: false,
    description: 'Committed offense IDs — required when role is respondent',
  })
  offense_ids?: string[];

  // Available for Respondent only
  @ValidateIf(
    (o: CreateCasePartyDto) => o.role === HrErCasePartyRole.respondent,
  )
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    type: [String],
    required: false,
    description:
      'Policy violated (violation) IDs — required when role is respondent',
  })
  violation_ids?: string[];

  // Available for Respondent only
  @ValidateIf(
    (o: CreateCasePartyDto) => o.role === HrErCasePartyRole.respondent,
  )
  @ValidateNested()
  @Type(() => CreateCasePartyActionDto)
  @IsOptional()
  @ApiProperty({
    type: CreateCasePartyActionDto,
    required: false,
    description:
      'Preventive suspension action. Only available for respondents with major level.',
  })
  action?: CreateCasePartyActionDto;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This employee is the respondent in the case.',
  })
  remarks?: string;
}

export class CreateCaseDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: 'Company UUID',
  })
  company_id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Location of the incident',
  })
  incident_location: string;

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

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'The date of the report',
  })
  report_date: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'Describe what happened, who was involved, where it happened and supporting circumstances',
  })
  incident_narrative: string;

  @ValidateNested({ each: true })
  @Type(() => CreateCasePartyDto)
  @HasRespondent()
  @ArrayMinSize(1)
  @ApiProperty({
    type: [CreateCasePartyDto],
    description:
      'Employees involved in the case. A respondent requires level, offense_ids, and violation_ids.',
    example: [
      {
        employee_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        role: 'respondent',
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
        role: 'complainant',
        remarks: 'Employee who reported the incident.',
      },
      {
        employee_id: 'c3d4e5f6-a7b8-9012-cdef-234567890123',
        role: 'witness',
        remarks: 'Employee who witnessed the incident.',
      },
    ],
  })
  parties: CreateCasePartyDto[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'e5f6a7b8-c9d0-1234-ef56-789012345678',
    description:
      'If converting a Case Intake/Report into this Disciplinary Case, its UUID',
    required: false,
  })
  intake_id?: string; // when converting
}
