import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateOvertimeRateDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    rate: number;
}