import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsInt, IsDefined } from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  @Expose()
  @ApiProperty({
    example: 'Cebu Air Inc',
    description: 'The name of the division',
  })
  name: string;

  @IsInt()
  @Expose()
  @ApiProperty({
    example: 3,
    description: 'ID number of the division head it belongs to',
  })
  division_head_id?: number;

  @IsInt()
  @IsDefined()
  @Expose({ name: 'status' }) // maps "status" input field to this property
  @ApiProperty({
    name: 'status',
    example: 'active',
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
