import { IsString, IsNotEmpty } from "class-validator";

export class CreateEmployeeStatusDto{

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    label: string;
}