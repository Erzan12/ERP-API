import { IsInt, IsString, IsNotEmpty } from "class-validator";

export class UpdateEmpStatusDto{

    @IsInt()
    @IsNotEmpty()
    emp_stat_id: number;

    @IsString()
    @IsNotEmpty()
    code?: string;

    @IsString()
    @IsNotEmpty()
    label?: string;
}