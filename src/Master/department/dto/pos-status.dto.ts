import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsInt, IsString, IsDefined, IsOptional } from "class-validator";

export class ReactivateDepartmentDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: 'ID of the department you want to activate' })
    department_id: number;

    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'status' }) // maps "status" input field to this property
    @ApiProperty({ name: 'status', example: 'active', description: 'Must be lowercase, if you want to update your Position status' })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'active') return 1;
        throw new BadRequestException(`Invalid status value: ${value}. Allowed value is active`);
    })
    @IsDefined()
    stat?: number;
}

export class DeactivateDepartmentDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 0, description: 'ID of the department you want to deactivate' })
    department_id: number;

    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'status' }) // maps "status" input field to this property
    @ApiProperty({ name: 'status', example: 'inactive', description: 'Must be lowercase, if you want to update your Position status' })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'inactive') return 0;
        throw new BadRequestException(`Invalid status value: ${value}. Allowed value is inactive`);
    })
    @IsDefined()
    stat?: number;
}