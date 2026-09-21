import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSalaryGradeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'SG25',
    description: 'Salary grade number 25',
  })
  grade: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '25000',
    description: 'Monthly salary or rate of an employee',
  })
  rate: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: '3',
    description: 'The level of this salary grade',
  })
  level: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description: 'If this SG is for confidential type of salary',
  })
  is_confidential: boolean;
}

export class UpdateSalaryGradeDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'SG25',
    description: 'Salary grade number 25',
  })
  grade: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '25000',
    description: 'Monthly salary or rate of an employee',
  })
  rate: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: '3',
    description: 'The level of this salary grade',
  })
  level: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: false,
    description: 'If this SG is for confidential type of salary',
  })
  is_confidential: boolean;
}
