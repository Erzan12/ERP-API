import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Software Engineer',
    description: 'The name of the position',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Supervisor',
    description: 'The hierarchy of this position',
  })
  hierarchy?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Supervises the development and life cycle of systems',
    description: 'The job description fit for this position',
  })
  job_description?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 2, description: 'Sorting number of the position' })
  sorting?: number;

  @IsUUID()
  @ApiProperty({
    example: 'Department PK UUID',
    description: 'The Department where the position is available',
  })
  department_id: string;
}

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'New Position name',
    description: 'If you want to update the Position Name',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Supervisor',
    description: 'The hierarchy of this position',
  })
  hierarchy?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Supervises the development and life cycle of systems',
    description: 'The job description fit for this position',
  })
  job_description?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 2, description: 'Sorting number of the position' })
  sorting?: number;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'Department PK UUID',
    description: 'The Department where the position is available',
  })
  department_id?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: 'true or false',
    description: 'true if active and false if set to inactive',
  })
  is_active: boolean;
}
