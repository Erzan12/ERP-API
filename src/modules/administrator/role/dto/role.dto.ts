import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDefined,
  IsOptional,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'IT Staff', description: 'Name of the role' })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'Office staff for IT department',
    description: 'Description of the role',
  })
  description: string;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'IT Staff', description: 'Name of the role' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Office staff for IT department',
    description: 'Description of the role',
  })
  description?: string;

  @IsOptional()
  @IsInt()
  @IsDefined()
  @Expose({ name: 'status' }) // maps " status" input field to this property
  @ApiProperty({
    name: 'status',
    example: 'active or inactive',
    description: 'active, inactive',
  })
  @Transform(({ value }) => {
    console.log('Transforming status:', value);
    if (value === undefined || value === null) return undefined;
    if (value === 'active') return 1;
    if (value === 'inactive') return 0;
    throw new BadRequestException(
      `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
    );
  })
  stat?: number;
}
