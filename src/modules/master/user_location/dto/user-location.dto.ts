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
  locationName: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    example: 'Consolacion',
    description: 'The address of the location',
  })
  address: string;
}

export class UpdateUserLocationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'New User Location',
    description: 'If you want to update the User Location name',
  })
  locationName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'New User Location address',
    description: 'If you want to update the User Location address',
  })
  address?: string;

  @IsBoolean()
  @IsOptional()
  @IsDefined()
  @ApiProperty({
    example: 'true or false',
    description: 'Update the status for the user location',
  })
  isActive?: boolean;
}
