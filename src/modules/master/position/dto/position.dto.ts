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
  @IsDefined()
  @Expose({ name: 'department' })
  @ApiProperty({
    name: 'department',
    example: 'Department PK UUID',
    description: 'The Department where the position is available',
  })
  // @Transform(({ value }) => {
  //   console.log('Transforming status:', value);
  //   if (value === 'human resources')
  //     return 'ddc33ca7-6088-4368-9c95-86f4b30e3cfd';
  //   if (value === 'information technology')
  //     return '4c0647c8-2b00-49dd-8a82-deee685dd95d';
  //   if (value === 'accounting') return '0fd6a4fb-6e39-4b98-9d8e-de76fa52e0f9';
  //   throw new BadRequestException(
  //     `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
  //   );
  // })
  department_id: string;

  // @IsInt()
  // @IsDefined()
  // @Expose({ name: 'status' }) // maps " status" input field to this property
  // @ApiProperty({
  //   name: 'status',
  //   example: 'active or inactive',
  //   description: 'active = 1, inactive = 0',
  // })
  // @Transform(({ value }) => {
  //   console.log('Transforming status:', value);
  //   if (value === 'active') return 1;
  //   if (value === 'inactive') return 0;
  //   throw new BadRequestException(
  //     `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
  //   );
  // })
  // stat?: number;
}

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'New Position name',
    description: 'If you want to update the Position Name',
  })
  position_name?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 2, description: 'Sorting number of the position' })
  sorting?: number;

  @IsOptional()
  @IsInt()
  @IsDefined()
  @Expose({ name: 'department' })
  @ApiProperty({
    name: 'department',
    example: 'human resources, information technology, accounting',
    description: 'The Department where the position is available',
  })
  @Transform(({ value }) => {
    console.log('Transforming status:', value);
    if (value === 'human resources')
      return 'ddc33ca7-6088-4368-9c95-86f4b30e3cfd';
    if (value === 'information technology')
      return '4c0647c8-2b00-49dd-8a82-deee685dd95d';
    if (value === 'accounting') return '0fd6a4fb-6e39-4b98-9d8e-de76fa52e0f9';
    throw new BadRequestException(
      `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
    );
  })
  department_id: string;

  @IsOptional()
  @IsInt()
  @IsDefined()
  @Expose({ name: 'status' }) // maps " status" input field to this property
  @ApiProperty({
    name: 'status',
    example: 'active or inactive',
    description: 'active = 1, inactive = 0',
  })
  @Transform(({ value }) => {
    console.log('Transforming status:', value);
    if (value === 'active') return 1;
    if (value === 'inactive') return 0;
    throw new BadRequestException(
      `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
    );
  })
  stat?: number;
}