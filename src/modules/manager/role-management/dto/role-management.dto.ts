import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class AddRoleToUserDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'PK UUID',
    description: 'Primary Key ID of the Role',
  })
  role_id: string;
}

export class AssignDirectPermissionDto {
  @IsUUID()
  @ApiProperty({ example: 'PK UUID', description: 'PK UUID of the user role' })
  role_id: string;

  @IsUUID('4', { each: true })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["Array of PK UUID"]',
    description:
      'Array PK UUID of the sub module permission to be assign directly to this user',
  })
  sub_module_permission_id: string[];
}

export class AssignCustomRolePermissiontDto {
  @IsUUID()
  @ApiProperty({ example: 'PK UUID', description: 'PK UUID of user role' })
  role_id: string;

  @IsUUID('4', { each: true })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["Array of PK UUID"]',
    description:
      'Array PK UUID of the role permission to be added to this user',
  })
  role_permission_id: string[];
}

export class AddUserPermissionDto {
  @IsUUID('4', { each: true })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["Array of PK UUID"]',
    description:
      'Array PK UUID of the role permission to be added to this user',
  })
  rolePermissionIds: string[];
}

export class UpdateUserSubmodule {
  @IsUUID()
  @ApiProperty({ example: 'PK UUID', description: 'PK UUID of user role' })
  role_id: string;

  @IsUUID('4', { each: true })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["Array of PK UUID"]',
    description:
      'Array PK UUID of the role permission to be added to this user',
  })
  subModuleId: string[];
}
