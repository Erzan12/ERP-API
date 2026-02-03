import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
ApiProperty

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Operations',
    description: 'The name of the module'
  })
  name: string;
}
