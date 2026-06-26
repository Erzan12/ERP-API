import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AddUserPermissionDto {
  // @IsInt()
  // @ApiProperty({
  //   example: "PK UUID",
  //   description: 'The id of the user to add role permission',
  // })
  // userId: string;

  // @IsInt()
  // @ApiProperty({
  //   example: "PK UUID",
  //   description: 'The id of role assigned to user',
  // })
  // roleId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsInt({ each: true })
  @ApiProperty({
    example: '["PK UUID", "PK UUID", "PK UUID"]',
    description:
      'The role permission id that will be assign or added to the user it is array because you can add multiple role permission',
  })
  rolePermissionIds: string[];
}
