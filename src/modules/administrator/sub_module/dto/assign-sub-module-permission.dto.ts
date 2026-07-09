import {
  IsArray,
  IsString,
  IsNotEmpty,
  IsUUID,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignSubModulePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'UUID', description: 'ID of the Sub Module' })
  sub_module_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["Array of PK UUID of submodule actions"]',
    description:
      'Assign permissions to sub module, also can add multiple permissions at once',
  })
  sub_module_actions_id: string[];
}
