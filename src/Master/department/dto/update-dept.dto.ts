import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, IsDefined } from "class-validator";

export class UpdateDeptDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: 'ID of the department you want to update' })
    department_id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'New Department name', description: 'If you want to update the Department Name' })
    department_name?: string;

    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'status' }) // maps "status" input field to this property
    @ApiProperty({ name: 'status', example: 'active or inactive', description: 'Must be lowercase, if you want to update your Department status' })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'active') return 1;
        throw new BadRequestException(`Invalid status value: ${value}. Allowed value is active`);
    })
    @IsDefined()
    stat?: number;
}