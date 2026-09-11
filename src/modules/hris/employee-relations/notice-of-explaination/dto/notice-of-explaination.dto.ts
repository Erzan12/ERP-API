import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HrErApprovalStatus, HrErNteServiceChannel } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNteDto {
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

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2026-08-20',
    required: false,
    description: 'Deadline for the respondent to submit a written explanation',
  })
  due_date?: string;

  @IsOptional()
  @IsEnum(HrErNteServiceChannel)
  @ApiProperty({ enum: HrErNteServiceChannel, required: false })
  service_channel?: HrErNteServiceChannel;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'NTE-2026-00042', required: false })
  reference_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'URL of the NTE form/letter, if already uploaded',
  })
  form_url?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    type: [String],
    description:
      'User IDs of reviewers who must sign off before this NTE is considered approved',
  })
  reviewer_ids: string[];
}

export class UpdateNteDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Disciplinary Case UUID',
    required: false,
  })
  disciplinary_case_id: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Party UUID',
    required: false,
  })
  party_id: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: '2026-08-20',
    required: false,
    description: 'Deadline for the respondent to submit a written explanation',
  })
  due_date?: string;

  @IsOptional()
  @IsEnum(HrErNteServiceChannel)
  @ApiPropertyOptional({ enum: HrErNteServiceChannel, required: false })
  service_channel?: HrErNteServiceChannel;

  // @IsOptional()
  // @IsString()
  // @ApiPropertyOptional({ example: 'NTE-2026-00042', required: false })
  // reference_number?: string;

  // @IsOptional()
  // @IsString()
  // @ApiPropertyOptional({
  //   required: false,
  //   description: 'URL of the NTE form/letter, if already uploaded',
  // })
  // form_url?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    description:
      'User IDs of reviewers who must sign off before this NTE is considered approved',
  })
  reviewer_ids?: string[];
}

export class ReviewNteApprovalDto {
  @IsIn(['approved', 'revise', 'rejected'] satisfies HrErApprovalStatus[])
  @ApiProperty({ enum: ['approved', 'revise', 'rejected'] })
  status: 'approved' | 'revise' | 'rejected';

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Please clarify the effectivity dates before this goes out.',
  })
  remarks?: string;
}
