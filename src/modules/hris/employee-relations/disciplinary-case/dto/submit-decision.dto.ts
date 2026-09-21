import { HrErDecisionType } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class SubmitDecisionDto {
  @IsEnum(HrErDecisionType)
  decisionType: HrErDecisionType;

  @IsOptional()
  @IsDateString()
  effectivityStart?: string;

  @IsOptional()
  @IsDateString()
  effectivityEnd?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
