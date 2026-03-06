import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, IsInt, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

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
    name: 'department',
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
  @IsInt()
  @IsDefined()
  @Expose({ name: 'status' })
  @ApiProperty({
    name: 'status', // -> maps status
    example: '1 or 0',
  })
  @Transform(({ value }) => {
    console.log('Transforming status:', value);
    if (value === undefined || value === null) return undefined; // allow missing
    if (value === 'active') return 1;
    if (value === 'inactive') return 0;
    throw new BadRequestException(
      `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
    );
  })
  stat?: number;
}