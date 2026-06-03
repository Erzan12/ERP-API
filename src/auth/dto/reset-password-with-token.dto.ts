import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordWithTokenDto {
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be atleast 8 characters long' })
  @ApiProperty({ example: 'newpassword', description: 'user new password' })
  newPassword: string;
}

export class UserEmailResetTokenDto {
  @IsEmail()
  @ApiProperty({
    example: 'employee.email@gmail.com',
  })
  @IsNotEmpty()
  email: string;
}
