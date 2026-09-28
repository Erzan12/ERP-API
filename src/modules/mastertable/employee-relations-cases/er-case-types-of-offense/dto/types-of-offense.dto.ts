import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateErCaseTypesOfOffenseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Tardiness',
  })
  type_of_offense: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'This is for tardy employees',
  })
  description: string;
}

export class UpdateErCaseTypesOfOffenseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Tardiness',
  })
  type_of_offense?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'This is for tardy employees',
  })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: 'true or false',
  })
  is_active?: boolean;
}
