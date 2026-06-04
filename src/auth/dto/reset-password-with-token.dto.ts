import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordWithTokenDto {
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be atleast 8 characters long' })
  @ApiProperty({ example: 'newpassword', description: 'user new password' })
  newPassword: string;
}

export class ResendInvitationTokenDto {
  @IsEmail()
  @ApiProperty({
    example: 'employee.email@gmail.com',
  })
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordDto {
  // @IsNotEmpty()
  // @MinLength(8, { message: 'Password must be atleast 8 characters long' })
  // @ApiProperty({ example: 'newpassword', description: 'user new password' })
  // newPassword: string;
  @IsEmail()
  @ApiProperty({
    example: 'employee.email@gmail.com',
  })
  @IsNotEmpty()
  identifier: string;
}

export class VerifyForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'employee.email@gmail.com',
  })
  identifier: string;

  @IsString()
  @ApiProperty({
    example: 'OTP code',
  })
  otp: string;

  @IsString()
  @ApiProperty({
    example: 'new password',
  })
  newPassword: string;
}