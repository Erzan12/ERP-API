import { IsString, IsDefined, IsBoolean, IsUUID, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubmodulePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'PK UUID',
    description: 'Primary Key ID of a Submodule',
  })
  sub_module_id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'New sub module name',
    description: 'If you want to update current submodule name',
  })
  name?: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['read, create, update, delete'],
    description: 'If you want to update the current actions',
  })
  actions: string[];

  @IsBoolean()
  // @IsDefined()
  @IsOptional()
  @ApiProperty({
    example: 'true or false',
    description: 'If you want to update the status of the sub module',
  })
  is_active?: boolean;
}

export class UpdateSubmoduleActionDto {
  // @IsUUID()
  // @IsNotEmpty()
  // sub_module_id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'New sub module name',
    description: 'If you want to update current submodule name',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'read, create, update, delete',
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
