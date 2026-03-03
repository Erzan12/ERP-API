import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

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
