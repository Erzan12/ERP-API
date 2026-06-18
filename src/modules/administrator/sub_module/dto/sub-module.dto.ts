import { IsString, IsNotEmpty, IsUUID, IsOptional, IsArray, IsBoolean } from 'class-validator';
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

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['read, create, update, delete'],
    description: 'If you want to update the current actions',
  })
  actions: string[];
}

export class UpdateSubmoduleDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'New sub module name',
    description: 'If you want to update current submodule name',
  })
  name?: string;

  // @IsNotEmpty()
  // @IsArray()
  // @IsString({ each: true })
  // @ApiProperty({
  //   example: ['read, create, update, delete'],
  //   description: 'If you want to update the current actions',
  // })
  // actions: string[];
  
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: 'PK UUID',
    description: 'Module ID of the submodule ',
  })
  module_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: 'true or false',
    description: 'If you want to update the status of the sub module',
  })
  is_active?: boolean;
}
