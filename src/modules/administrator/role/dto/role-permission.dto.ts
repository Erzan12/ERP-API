import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateRolePermissionDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true }) // Make sure each string is not an empty string
  @ApiProperty({
    example: '["read", "update", "create", "delete"]',
    description:
      'Assign/Update permissions to role, also can add multiple permissions at once',
  })
  @ArrayNotEmpty()
  actions: string[];

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'Primary Key ID of the Sub Module' })
  sub_module_id: string;

  // @IsInt()
  // @IsOptional()
  // @ApiProperty({ example: 1, description: 'ID of the Module' })
  // module_id: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'Primary Key ID of the Role' })
  role_id: string;

  // @IsUUID()
  // @IsNotEmpty()
  // @ApiProperty({ example: 1, description: 'ID of the Department' })
  // department_id: string;

  // @IsUUID()
  // @IsNotEmpty()
  // @IsOptional()
  // @ApiProperty({ example: 1, description: 'ID of the Position' })
  // position_id?: string;
}

export class UpdateRolePermissionsDto {
  @IsString({ each: true })
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: '["read", "update", "delete", "create"]',
    description: 'User can add or update new permission for a current role',
  })
  @ArrayNotEmpty()
  action_updates: {
    currentAction: string;
    newAction: string;
  }[];
}
