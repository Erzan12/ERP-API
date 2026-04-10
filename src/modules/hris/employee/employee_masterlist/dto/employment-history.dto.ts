import { ApiProperty } from "@nestjs/swagger";
import { EvaluationStage, EvaluationStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEmploymentHistory {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        name: 'employee_id',
        example: 'PK UUID of employee',
        description: 'UUID of the employee'
    })
    employee_id: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        example: '2026-06-06',
        description: 'Effectivity date of this adjustment',
    })
    effective_date: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Value Changed',
        description: 'The old and new value',
    })
    value_changed: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Old value',
        description: 'Old data value'
    })
    from_val: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'New Value',
        description: 'New data value'
    })
    to_val: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Remarks',
        description: 'Comments or remarks about this changed'
    })
    remarks: string;

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
    evaluation_stage: EvaluationStage;

    @IsOptional()
    @IsString()
    @IsEnum(EvaluationStatus, {
        message: 'Evaluation Status must be pending, overdue or completed'
    })
    @Type(() => String)
    @ApiProperty({
        enum: EvaluationStatus,
        example: EvaluationStatus.pending,
        description: 'The evaluation status of this employee'
    })
    evaluation_status: EvaluationStatus;
}