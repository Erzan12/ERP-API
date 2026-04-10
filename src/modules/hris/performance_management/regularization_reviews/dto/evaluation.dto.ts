import { IsUUID, IsEnum, IsOptional, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { EvaluationStage } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEvaluationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
      name: 'employee_id',
      example: 'PK UUID of employee',
      description: 'UUID of the employee'
  })
  employee_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
      name: 'evaluator_id',
      example: 'PK UUID of evaluator employee',
      description: 'UUID of the evaluator employee'
  })
  evaluator_id: string;

  @IsOptional()
  @IsString()
  @IsEnum(EvaluationStage, {
      message: 'Evaluation Stage must be third_month_evaluation or fifth_month_evaluation'
  })
  @Type(() => String)
  @ApiProperty({
      enum: EvaluationStage,
      example: EvaluationStage.third_month_evaluation,
      description: 'The evaluation stage of this employee'
  })
  stage: EvaluationStage;

  // optional override (HR can manually adjust)
  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2026-10-04',
    description: 'Due date of the evaluation'
  })
  due_date?: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2026-10-04',
    description: 'Start date of probation period'
  })
  probation_date: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2026-10-04',
    description: 'End of probation period and start of regularization period'
  })
  regularization_date: string;
}