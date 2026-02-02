import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class AssignTemplateDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: 'The user id of the user' })
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'The permission template id to be assigned to user',
  })
  template_id: number;
}
