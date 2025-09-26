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

    @IsInt()
    @ApiProperty({ example: 2, description: 'Sorting number of the position' })
    sorting?: number;

    @IsInt()
    @IsDefined()
    @Expose({ name: 'department' })
    @ApiProperty({
        name: 'department',
        example: 'human resources = 1, information technology = 2, accounting = 6',
        description: 'The Department where the position is available'
    })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'human resources') return 1;
        if (value === 'information technology') return 2;
        if (value === 'accounting') return 6;
        throw new BadRequestException(
            `Invalid status value ${value}. Allowed values are "active" or "inactive"`
        )
    })
    department_id: number;

    @IsInt()
    @IsDefined()
    @Expose({ name: 'status' }) // maps " status" input field to this property
    @ApiProperty({
        name: 'status',
        example: 'active or inactive',
        description: 'active = 1, inactive = 0'
    })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'active') return 1;
        if (value === 'inactive') return 0;
        throw new BadRequestException(
            `Invalid status value ${value}. Allowed values are "active" or "inactive"`
        );
    })
    stat?: number;
}