import {
    IsNotEmpty,
    IsInt,
    ValidateNested,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { UserDetailsDto } from './user-details.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserWithRolePermissionDto {
  @ApiProperty({ type: () => UserDetailsDto })
  @ValidateNested()
  @Type(() => UserDetailsDto)
  user_details: UserDetailsDto;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    type: [Number],
    example: [1],
    description: 'The role permission IDs to assign to the user',
  })
  role_permission_ids?: number[];
}
