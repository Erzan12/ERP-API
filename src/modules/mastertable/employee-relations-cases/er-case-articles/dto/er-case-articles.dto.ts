import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateErCaseDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "Article I. Use of Time Card & Attendance Sheet",
    })
    @IsString()
    title: string;
}

export class UpdateErCaseDto {
    @IsOptional()
    @ApiProperty({
        example: "Article I. Use of Time Card & Attendance Sheet",
    })
    @IsString()
    title?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        example: "true or false",
    })
    is_active: boolean;
}