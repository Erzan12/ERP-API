import {
  IsUUID,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EvaluationStage, EvaluationRecommendation } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateEvaluationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    name: 'employee_id',
    example: 'PK UUID of employee',
    description: 'UUID of the employee',
  })
  employee_id: string;

  @IsEnum(EvaluationStage, {
    message:
      'Evaluation Stage must be third_month_evaluation or fifth_month_evaluation',
  })
  @Type(() => String)
  @ApiProperty({
    enum: EvaluationStage,
    example: EvaluationStage.third_month_evaluation,
    description: 'The evaluation stage of this employee',
  })
  stage: EvaluationStage;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  is_reviewed: boolean;

  @IsEnum(EvaluationRecommendation, {
    message: 'Valid evaluation recommenation: pass, fail',
  })
  @IsOptional()
  @ApiPropertyOptional({
    example: EvaluationRecommendation.pass,
  })
  recommendation: EvaluationRecommendation;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: '2026-01-10',
    description: 'Evaluation date for this employee',
  })
  date_evaluated?: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2026-01-10',
    description: 'The scheduled evaluation date for this employee',
  })
  scheduled_evaluation_date: string;
}
