import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Operations',
    description: 'The name of the module',
  })
  name: string;
}

export class UpdateModuleDto extends PartialType(CreateModuleDto) {}
