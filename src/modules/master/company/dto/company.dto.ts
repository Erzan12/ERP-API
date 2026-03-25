import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsDefined,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Avega Bros. Integrated Shipping Corp',
    description: 'Name of the company',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Cebu City, Cebu',
    description: 'Address or location of the company',
  })
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '011-63-45-123-4567',
    description: 'Telephone No. of the company',
  })
  telephone_no?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '011-63-2-1234567',
    description: 'Fax No. of the company',
  })
  fax_no?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '11-M1115-1234',
    description: 'Registered Tax Identification No. of the company',
  })
  company_tin?: string;

  @IsInt()
  @IsDefined()
  @IsOptional()
  @Expose({ name: 'is_top_20000' })
  @ApiProperty({
    example: 'yes or no',
    description: 'yes = 1, no = 0',
  })
  @Transform(({ value }) => {
    console.log('Transforming status:', value);
    if (value === 'yes') return 1;
    if (value === 'no') return 2;
    throw new BadRequestException(
      `Invalid is_top_20000 value ${value}. Allowed values are "yes" or "no"`,
    );
  })
  is_top_20000?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: 'ABISC',
    description: 'Short name or abbreviation of the company',
  })
  abbreviation: string;

  //   @IsInt()
  //   @IsDefined()
  //   @Expose({ name: 'status' }) // maps " status" input field to this property
  //   @ApiProperty({
  //     example: 'active or inactive',
  //     description: 'active = 1, inactive = 0',
  //   })
  //   @Transform(({ value }) => {
  //     console.log('Transforming status:', value);
  //     if (value === 'active') return 1;
  //     if (value === 'inactive') return 0;
  //     throw new BadRequestException(
  //       `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
  //     );
  //   })
  //   stat?: number;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Avega Bros. Integrated Shipping Corp',
    description: 'Update current company name',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Cebu City, Cebu',
    description: 'Update current company location',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '011-63-45-123-4567',
    description: 'Update current company telephone no.',
  })
  telephone_no?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '011-63-2-1234567',
    description: 'Update current company fax no.',
  })
  fax_no?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '11-M1115-1234',
    description: 'Update current company tin no.',
  })
  company_tin?: string;

  @IsInt()
  @IsOptional()
  @Expose({ name: 'is_top_20000' })
  @ApiProperty({
    example: 'yes or no',
    description: 'Update current company is top 20000?',
  })
  @Transform(({ value }) => {
    console.log('Transforming status:', value);
    if (value === undefined || value === null) return undefined; //allow missing
    if (value === 'yes') return 1;
    if (value === 'no') return 0;
    throw new BadRequestException(
      `Invalid is_top_20000 value ${value}. Allowed values are "yes" or "no"`,
    );
  })
  is_top_20000?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: 'ABISC',
    description: 'Update current company abbreviation',
  })
  abbreviation?: string;

  @IsBoolean()
  @IsDefined()
  @ApiProperty({
    example: 'true or false',
    description: 'Update current company status',
  })
  isActive?: boolean;
}
