import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateRolePermissionDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true }) // ✅ Make sure each string is not an empty string
  @ApiProperty({
    example: '["read", "update", "create", "delete"]',
    description:
      'Assign permissions to role, also can add multiple permissions at once',
  })
  @ArrayNotEmpty()
  action: string[];

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'ID of the Sub Module' })
  sub_module_id: string;

  // @IsInt()
  // @IsOptional()
  // @ApiProperty({ example: 1, description: 'ID of the Module' })
  // module_id: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'ID of the Role' })
  role_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'ID of the Department' })
  department_id: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'ID of the Position' })
  position_id?: string;
}
