import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateOvertimeRateDto {
    @ApiProperty({
        example: 'Regular Day'
    })
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiProperty({
        example: .25
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    rate: number;
}