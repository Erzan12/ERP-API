import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsInt,
} from 'class-validator';
import { InterviewStage } from 'src/utils/decorators/global.enums.decorator';

export class AssignInterviewerDto {
  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @IsUUID()
  @IsNotEmpty()
  applicant_id: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(InterviewStage, {
    message: 'Interview stage must be Initial, Second, and Final',
  })
  @Type(() => String)
  @ApiProperty({
    enum: InterviewStage,
    example: InterviewStage.INITIAL,
    description: 'The interview stage of the applicant',
  })
  interview_stage: InterviewStage;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-03-21',
    description: 'The date of applicant interview',
  })
  date_of_interview: string;

  @IsString()
  @IsNotEmpty()
  remarks: string;

  @IsInt()
  @IsNotEmpty()
  total_points: number;

  @IsString()
  @IsNotEmpty()
  recommendation: string;
}
