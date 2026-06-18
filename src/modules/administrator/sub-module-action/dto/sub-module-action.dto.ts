import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsOptional, IsBoolean, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubModuleActionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'action',
    example: 'read',
    description:
      'Create action/permission for for Submodule ',
  })
  action: string;
}

export class UpdateSubmoduleActionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'read',
    description: 'If you want to update the current action',
  })
  action?: string;

  @IsBoolean()
  @IsDefined()
  @ApiProperty({
    example: 'true or false',
    description: 'If you want to update the status of the sub module',
  })
  is_active?: boolean;
}
