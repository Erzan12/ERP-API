import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailResetTokenDto {
  @IsEmail()
  @ApiProperty({
    example: 'employee.email@gmail.com',
  })
  @IsNotEmpty()
  email: string;
}
