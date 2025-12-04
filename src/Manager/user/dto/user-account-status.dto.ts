import { IsInt, IsNotEmpty } from "class-validator";

export class DeactivateUserAccountDto {
    @IsInt()
    @IsNotEmpty()
    user_id: number;
}

export class ReactivateUserAccountDto {
    @IsInt()
    @IsNotEmpty()
    user_id: number;
}