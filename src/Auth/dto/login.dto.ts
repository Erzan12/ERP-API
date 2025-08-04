import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @MinLength(5)
    @ApiProperty({ example: 'admin', description: 'User username' })
    username: string;

    @IsString()
    @MinLength(5)
    @ApiProperty({ example: '1234567890', description: 'User password'})
    password: string;
}