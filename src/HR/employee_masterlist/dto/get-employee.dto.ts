import { IsInt, IsNotEmpty } from "class-validator";

export class GetEmployeeDto {

    @IsInt()
    @IsNotEmpty()
    employee_id: number;
}