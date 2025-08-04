import { 
    IsEmail,
    IsNotEmpty, 
    MinLength, 
    IsString, 
    IsInt
} from 'class-validator';

export class UserDetailsDto {
    @IsNotEmpty()
    employee_id: string;
    
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}

