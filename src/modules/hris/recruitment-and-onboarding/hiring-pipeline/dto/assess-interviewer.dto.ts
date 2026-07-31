import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  ArrayMinSize,
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
  // @IsUUID()
  // @IsNotEmpty()
  // @ApiProperty({
  //   example: 'Interviewer UUID is the employee UUID',
  //   description: 'The UUID of the interviewer assignment record.',
  // })
  // interviewer_id: string; // The ID of the Interviewer record being updated

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Applicant showed strong communication skills.',
    description: 'The remark of the interviewer',
  })
  remarks: string;

  // @IsString()
  // @IsEnum(InterviewStage, {
  //   message: 'Interview stage initial, second and final',
  // })
  // @Type(() => String)
  // @ApiProperty({
  //   enum: InterviewStage,
  //   example: InterviewStage.initial,
  //   description: 'The interview stage for the interviewer',
  // })
  // stage: InterviewStage;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    example: 87,
    description: 'Total points given by the interviewer.',
  })
  total_points: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Recommended for next stage.',
    description: 'Recommendation of the interviewer.',
  })
  recommendations: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExaminationRatingDto)
  @ApiProperty({
    type: [ExaminationRatingDto],
    example: [
      {
        exam_name: 'Written Exam',
        result: 'Passed',
        remarks: 'Good technical understanding.',
      },
    ],
  })
  ratings: ExaminationRatingDto[];
}
