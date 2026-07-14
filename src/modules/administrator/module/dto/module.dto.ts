import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Operations',
    description: 'The name of the module',
  })
  name: string;
}

// export class UpdateModuleDto extends PartialType(CreateModuleDto) {}

export class UpdateModuleDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Update the module name',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Update module status',
  })
  is_active?: boolean;
}
