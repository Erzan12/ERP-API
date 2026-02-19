import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ExecuteDbQueryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    sql: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    purpose: string;
}