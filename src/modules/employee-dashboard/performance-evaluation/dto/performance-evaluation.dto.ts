import { ApiProperty } from "@nestjs/swagger";
import { EvaluationDecision, PerformanceRating } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class EvaluationDetailDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: "uuid-1",
    description: "The competency ID",
  })
  competency_id: string;

  @IsNotEmpty()
  @IsEnum(PerformanceRating, {
    message:
      "Valid inputs are unsatisfactory, needs_improvement, meets_expectations, exceed_expectations, exceptional",
  })
  @Type(() => String)
  @ApiProperty({
    enum: PerformanceRating,
    example: PerformanceRating.meets_expectations,
    description: "The score for the competency",
  })
  rating: PerformanceRating;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "Doing well",
    description: "Evaluator's remarks for this competency",
  })
  remarks: string;
}

export class SubmitEvaluationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluationDetailDto)
  @ApiProperty({
    type: [EvaluationDetailDto],
    description: "List of competency evaluations",
    example: [
      {
        competency_id: "uuid-1",
        rating: "meets_expectations",
        remarks: "Doing well",
      },
      {
        competency_id: "uuid-2",
        rating: "exceptional",
        remarks: "Exceeded targets",
      },
    ],
  })
  details: EvaluationDetailDto[];

  @IsNotEmpty()
  @IsEnum(EvaluationDecision, {
    message:
      "Valid inputs are for_evaluation, for_regularization, for_rehire, for_promotion, for_dismissal",
  })
  @Type(() => String)
  @ApiProperty({
    enum: EvaluationDecision,
    example: EvaluationDecision.for_regularization,
    description: "Final evaluation decision",
  })
  decision: EvaluationDecision;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "Overall strong performance",
    description: "Overall evaluator comments",
  })
  comments: string;
}

export class AcknowledgeEvaluationDto {
  @IsString()
  @ApiProperty({
    example: 'Employee response or message of appreciation'
  })
  @IsNotEmpty()
  response: string;
}