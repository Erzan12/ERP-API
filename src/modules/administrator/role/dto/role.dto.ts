import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
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

export class UpdateRolePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'Primary Key ID of the Role' })
  role_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'Primary Key ID of the Sub Module' })
  sub_module_id: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ApiProperty({
    example: '["Array of PK UUID of sub module permission id"]',
    description:
      'Assign/Update permissions to role, also can add multiple permissions at once',
  })
  sub_module_permission_id?: string[];
}
