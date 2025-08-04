import { IsString, IsNotEmpty } from "class-validator";

export class EmpStatusDto{

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    label: string;
}