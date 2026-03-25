import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdatePermissionTemplateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'Accounting Clerk Template' })
  name?: string;

  @IsInt({ each: true }) // validate if item is an integer
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'ID of the department for this permission template',
  })
  department_id: string;

  @IsInt({ each: true })
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'ID of the position for this permission template',
  })
  position_id?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    example: [1, 2, 3],
    description: 'List of role_permission IDs to associate with the template',
  })
  role_permission_ids?: string[];
}
