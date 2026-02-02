import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubModuleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'User Account',
    description: 'The name of the sub module',
  })
  name: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'Module ID of the submodule ' })
  module_id: number;
}
