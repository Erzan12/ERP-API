import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDivisionDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'ID of the division you want to update',
  })
  division_id: number;

  @IsString()
  @ApiProperty({
    example: 'New Division Name',
    description: 'If you want to update the Division name',
  })
  division_name?: string;

  @IsInt()
  @IsDefined()
  @Expose({ name: 'status' }) // maps "status" input field to this property
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
      `Invalid status value: ${value}. Allowed values are "active" or "inactive".`,
    );
  })
  stat: number;
}
