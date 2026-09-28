import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDetailsDto } from './user-details.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserWithRoleDto {
  @ApiProperty({ type: () => UserDetailsDto })
  @ValidateNested()
  @Type(() => UserDetailsDto)
  user_details: UserDetailsDto;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Administrator',
    description: 'The role to be assign to a user',
  })
  role_name: string;
}
