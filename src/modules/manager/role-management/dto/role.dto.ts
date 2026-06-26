import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddRoleToUserDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'PK UUID',
    description: 'Primary Key ID of the Role',
  })
  role_id: string;
}
