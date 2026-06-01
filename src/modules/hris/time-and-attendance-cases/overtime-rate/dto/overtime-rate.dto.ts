import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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

export class UpdateOvertimeRateDto {
    @ApiProperty({
        example: 'Regular Day'
    })
    @IsOptional()
    @IsString()
    type: string;

    @ApiProperty({
        example: .25
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    rate: number;
}