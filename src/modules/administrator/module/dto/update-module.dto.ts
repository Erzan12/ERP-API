import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class UpdateModuleDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The id of the module to update'
  })
  module_id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'New module name',
    description: 'Update current module name'
  })
  name: string;
}
