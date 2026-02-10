import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class AddUserRolePermissionsDto {
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The id of the user to add role permission',
  })
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    example: [101, 102, 103],
    description:
      'The role permission id that will be assign or added to the user it is array because you can add multiple role permission',
  })
  rolePermissionIds: string[];
}
