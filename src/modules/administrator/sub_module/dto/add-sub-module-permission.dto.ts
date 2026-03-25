import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddSubModulePermissionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({
    name: 'action',
    example: '["view", "create", "update", "note", "delete"]',
    description:
      'Create permission for sub module, also can add multiple permissions at once',
  })
  action: string[];

  // @IsInt()
  // @IsDefined()
  // @Expose({ name: 'status' }) // maps " status" input field to this property
  // @ApiProperty({
  //   name: 'status',
  //   example: 'active or inactive',
  //   description: 'active = 1, inactive = 0',
  // })
  // @Transform(({ value }) => {
  //   console.log('Transforming status:', value);
  //   if (value === 'active') return 1;
  //   if (value === 'inactive') return 0;
  //   throw new BadRequestException(
  //     `Invalid status value ${value}. Allowed values are "active" or "inactive"`,
  //   );
  // })
  // stat?: number;
}
