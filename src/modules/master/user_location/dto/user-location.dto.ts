import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserLocationDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Tayud',
    description: 'The name of the place the user located',
  })
  location_name: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    example: 'Consolacion',
    description: 'The address_line_1 of the location',
  })
  address_line_1: string;

  @IsString()
  @IsOptional()
  @IsDefined()
  @ApiProperty({
    example: 'Tayud',
    description: 'The address_line_2 of the location',
  })
  address_line_2?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Cebu City',
    description: 'City of the location',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Province of Cebu',
    description: 'Province of the location',
  })
  province: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Philippines',
    description: 'Country of location',
  })
  country: string;
}

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
  @IsDefined()
  @ApiProperty({
    example: 'Consolacion',
    description: 'The address_line_1 of the location',
  })
  address_line_1?: string;

  @IsString()
  @IsOptional()
  @IsDefined()
  @ApiProperty({
    example: 'Tayud',
    description: 'The address_line_2 of the location',
  })
  address_line_2?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Cebu City',
    description: 'City of the location',
  })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Province of Cebu',
    description: 'Province of the location',
  })
  province?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Philippines',
    description: 'Country of location',
  })
  country?: string;

  @IsBoolean()
  @IsOptional()
  @IsDefined()
  @ApiProperty({
    example: 'true or false',
    description: 'Update the status for the user location',
  })
  isActive?: boolean;
}
