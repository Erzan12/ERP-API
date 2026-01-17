import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, IsDefined } from "class-validator";

export class UpdateDepartmentDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: 'ID of the department you want to update' })
    department_id: number;

    @IsString()
    @ApiProperty({ example: 'New Department name', description: 'If you want to update the Department name' })
    department_name?: string;

    @IsInt()
    @ApiProperty({ example: 2, description: 'Sorting number of the department' })
    sorting?: number;

    @IsInt()
    @IsDefined()
    @Expose({ name: 'division'})
    @ApiProperty({
        name: 'division',
        example: 'corporate services = 1, asset management = 2, marketing and operations = 3, cebu air inc = 3',
        description: 'The Division where the department belongs to'
    })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'corporate services') return 1;
        if (value === 'asset management') return 2;
        if (value === 'marketing and operations') return 3;
        if (value === 'cebu air inc') return 4;
        throw new BadRequestException(
            `Invalid status value: ${value}. Allowed values are "corporate services", "asset management", "marketing and operations", "cebu air inc".`
        );
    })
    division_id?: number;

    @IsInt()
    @IsDefined()
    @Expose({ name: 'status' }) // maps "status" input field to this property
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
            `Invalid status value: ${value}. Allowed values are "active" or "inactive".`
        );
    })
    stat?: number;
}