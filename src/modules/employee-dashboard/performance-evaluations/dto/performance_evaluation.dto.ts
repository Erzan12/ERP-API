import { ApiProperty } from '@nestjs/swagger';
import {
  EvaluationDecision,
  EvaluationStage,
  PerformanceRating,
  TypeOfEvaluation,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class EvaluationDetailDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'uuid-1',
    description: 'The competency ID',
  })
  competency_id: string;

  @IsNotEmpty()
  @IsEnum(PerformanceRating, {
    message:
      'Valid inputs are unsatisfactory, needs_improvement, meets_expectations, exceed_expectations, exceptional',
  })
  @Type(() => String)
  @ApiProperty({
    enum: PerformanceRating,
    example: PerformanceRating.meets_expectations,
    description: 'The score for the competency',
  })
  rating: PerformanceRating;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Doing well',
    description: "Evaluator's remarks for this competency",
  })
  remarks: string;
}

export class SubmitEvaluationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    name: 'employee_id',
    example: 'PK UUID of employee',
    description: 'UUID of the employee',
  })
  employee_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    name: 'evaluator_id',
    example: 'PK UUID of evaluator employee',
    description: 'UUID of the evaluator employee',
  })
  evaluator_id: string;

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

  @IsEnum(TypeOfEvaluation, {
    message:
      'Evaluation Stage must be third_month_evaluation or fifth_month_evaluation',
  })
  @Type(() => String)
  @ApiProperty({
    enum: TypeOfEvaluation,
    example: TypeOfEvaluation.for_regularization,
    description: 'The type of evaluation of this employee',
  })
  type_of_evaluation: TypeOfEvaluation;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2026-01-10',
    description: 'Start date of the employee/hire date',
  })
  evaluation_period_start: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2026-01-10',
    description:
      'End date of the employee for this evaluation; 3rd month eval or 5th month eval',
  })
  evaluation_period_end: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluationDetailDto)
  @ApiProperty({
    type: [EvaluationDetailDto],
    description: 'List of competency evaluations',
    example: [
      {
        competency_id: 'uuid-1',
        rating: 'meets_expectations',
        remarks: 'Doing well',
      },
      {
        competency_id: 'uuid-2',
        rating: 'exceptional',
        remarks: 'Exceeded targets',
      },
    ],
  })
  details: EvaluationDetailDto[];

  @IsNotEmpty()
  @IsEnum(EvaluationDecision, {
    message:
      'Valid inputs are for_evaluation, for_regularization, for_rehire, for_promotion, for_dismissal',
  })
  @Type(() => String)
  @ApiProperty({
    enum: EvaluationDecision,
    example: EvaluationDecision.for_regularization,
    description: 'Final evaluation decision',
  })
  decision: EvaluationDecision;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Overall strong performance',
    description: 'Overall evaluator comments',
  })
  comments: string;
}

export class AcknowledgeEvaluationDto {
  @IsString()
  @ApiProperty({
    example: 'Employee response or message of appreciation',
  })
  @IsNotEmpty()
  response: string;
}
