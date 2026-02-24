import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserLocationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'New User Location',
    description: 'If you want to update the User Location name',
  })
  location_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'New User Location address',
    description: 'If you want to update the User Location address',
  })
  address?: string;
 
  @IsInt()
  @IsOptional()
  @IsDefined()
  @Expose({ name: 'status' }) //maps "status" input field to this property
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
      `Invalid status value: ${value}. Allowed vales are "active" or "inactive".`,
    );
  })
  stat?: number;
}
