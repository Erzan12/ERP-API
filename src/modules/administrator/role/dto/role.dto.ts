import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
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

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'PK UUID',
    description: 'Department the role belongs to',
  })
  department_id: string;
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
  @IsUUID()
  @ApiProperty({
    example: 'PK UUID',
    description: 'Department the role belongs to',
  })
  department_id: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: true,
    description: 'If you want to update the status of the role',
  })
  is_active?: boolean;
}
