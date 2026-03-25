import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDetailsDto {
  @IsString()
  @ApiProperty({
    example: 'ABISC-250710-001',
    description: 'The ID of the employee to link this user to',
  })
  employee_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'sample_username',
    description: 'The username for the new user',
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    example: 'sample@gmail.com',
    description: 'Email address for the new user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'avegabros',
    description: 'Password for the new user',
  })
  password: string;
}
