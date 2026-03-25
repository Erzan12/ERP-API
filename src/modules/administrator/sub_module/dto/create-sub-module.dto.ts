import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubModuleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'User Account',
    description: 'The name of the sub module',
  })
  name: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'PK UUID',
    description: 'Module ID of the submodule ',
  })
  module_id: string;
}
