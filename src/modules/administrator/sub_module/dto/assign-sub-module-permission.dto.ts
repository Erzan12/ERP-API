import {
  IsArray,
  ArrayNotEmpty,
  IsString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignSubModulePermissionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true }) // ✅ Make sure each string is not an empty string
  @ApiProperty({
    example: '["read", "update", "create", "delete"]',
    description:
      'Assign permissions to sub module, also can add multiple permissions at once',
  })
  action: string[];

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'UUID', description: 'ID of the Sub Module' })
  sub_module_id: string;
}
