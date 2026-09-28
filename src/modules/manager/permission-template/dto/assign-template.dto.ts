import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class AssignTemplateDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 'UUID', description: 'The user uuid of the user' })
  user_id: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 'UUID',
    description: 'The permission template uuid to be assigned to user',
  })
  template_id: string;
}
