import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsInt, IsString, IsDefined, IsOptional } from "class-validator";

export class UpdatePositionDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: 'ID of the position you want to update' })
    position_id: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: "New Position name", description: 'If you want to update the Position Name' })
    position_name?: string;

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, description: 'ID of the department you want to update' })
    department_id?: number;

    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'status' }) // maps "status" input field to this property
    @ApiProperty({ name: 'status', example: 'active or inactive', description: 'Must be lowercase, if you want to update your Position status' })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'active') return 1;
        throw new BadRequestException(`Invalid status value: ${value}. Allowed value is active`);
    })
    @IsDefined()
    stat?: number;
}