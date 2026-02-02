import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsInt, IsString } from 'class-validator';

export class CreateUserLocationDto {
  @IsString()
  @IsDefined()
  @ApiProperty({
    example: 'Tayud',
    description: 'The name of the place the user located',
  })
  location_name: string;

  @IsInt()
  @ApiProperty({
    example: 'Consolacion',
    description: 'The address of the location',
  })
  address: string;

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
      `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
    );
  })
  stat?: number;
}
