import { ApiProperty } from '@nestjs/swagger';
import { InterviewStage } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';

export class ExaminationRatingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Written Exam',
    description: 'The name of the exam',
  })
  exam_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    description: 'The result of the exam',
  })
  result: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    description: 'The remarks of the interviewer to the applicant',
  })
  remarks: string;
}

export class AssessInterviewDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    description: 'The interviewers uuid',
  })
  interviewer_id: string; // The ID of the Interviewer record being updated

  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Interviewer remarks',
    description: 'The remark of the interviewer',
  })
  remarks: string;

  @IsString()
  @IsEnum(InterviewStage, {
    message: 'Interview stage initial, second and final',
  })
  @Type(() => String)
  @ApiProperty({
    enum: InterviewStage,
    example: InterviewStage.initial,
    description: 'The interview stage for the interviewer',
  })
  stage: InterviewStage;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Points',
    description: 'total points of the applicant',
  })
  total_points: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Recommendations',
    description: 'What are the recommendations from interviewer',
  })
  recommendations: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExaminationRatingDto)
  @ApiProperty({ type: [ExaminationRatingDto] })
  ratings: ExaminationRatingDto[];
}
