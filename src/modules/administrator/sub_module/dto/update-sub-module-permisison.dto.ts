import { IsString, IsDefined, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubModulePermisisonDto {
  // @IsInt()
  // @IsNotEmpty()
  // @ApiProperty({
  //   example: 'UUID',
  //   description: 'ID of the sub module permission you want to update',
  // })
  // sub_module_permission_id: string;

  @IsString()
  @ApiProperty({
    example: 'view, create, update, note, delete',
    description: 'if you want to update the current actions',
  })
  action?: string;

  @IsBoolean()
  @IsDefined()
  @ApiProperty({
    example: 'true or false',
    description: 'If you want to update the status of the action ',
  })
  is_active?: boolean;
}
