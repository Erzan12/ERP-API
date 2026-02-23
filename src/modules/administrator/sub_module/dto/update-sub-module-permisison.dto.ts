import { IsString, IsInt, IsNotEmpty, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class UpdateSubModulePermisisonDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 'UUID',
    description: 'ID of the sub module permission you want to update',
  })
  sub_module_permission_id: string;

  @IsString()
  @ApiProperty({
    example: 'view, create, update, note, delete',
    description: 'if you want to update the current actions',
  })
  action?: string;

  @IsInt()
  @IsDefined()
  @Expose({ name: 'status' }) // maps " status" input field to this property
  @ApiProperty({
    name: 'status',
    example: 'active or inactive',
    description: 'If you want to update the status of the action ',
  })
  @Transform(({ value }) => {
    console.log('Transforming status:', value);
    if (value === 'active') return 1;
    if (value === 'inactive') return 0;
    throw new BadRequestException(
      `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
    );
  })
  stat?: number;
}
