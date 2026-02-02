//updated dto with transformer
import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Accounting Clerk Template' })
  name: string;

  @IsInt({ each: true }) // validate each item is an integer
  @ApiProperty({
    example: 1,
    description: 'ID of the department for this permission template',
  })
  department_id: number; //permission template can be applied to multiple departments

  @IsInt({ each: true }) // validate each item is an integer
  @ApiProperty({
    example: 1,
    description: 'ID of the position for this permission template',
  })
  position_id?: number; //permission template can be applied to multiple departments

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // validate each item is an integer
  @ApiProperty({
    example: [1, 2, 3],
    description: 'List of role_permission IDs to associate with the template',
  })
  role_permission_ids: number[]; //permission template can be applied to multiple departments
}
