import { ApiProperty } from '@nestjs/swagger';
import { IsString,  IsOptional } from 'class-validator';

export class UpdateModuleDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'New module name',
    description: 'Update current module name'
  })
  name: string;
}
