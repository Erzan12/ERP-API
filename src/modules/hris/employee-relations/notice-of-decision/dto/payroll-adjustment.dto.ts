import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class PayrollAdjustmentDto {
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '2026-09-01T09:00:00.000Z',
  })
  deduction_start?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '2026-09-05T09:00:00.000Z',
  })
  deduction_end?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: '2200',
  })
  total_deduction?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: '1100',
  })
  semi_monthly_deduction?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'This is be paid for two months.',
  })
  decision_remarks?: string;
}
