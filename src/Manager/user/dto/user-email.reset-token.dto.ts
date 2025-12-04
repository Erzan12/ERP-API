import { IsEmail, IsNotEmpty } from "class-validator";

export class UserEmailResetTokenDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}