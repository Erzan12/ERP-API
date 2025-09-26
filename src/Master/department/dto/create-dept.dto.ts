import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsInt, IsDefined } from 'class-validator';

export class CreateDepartmentDto {
    
    @IsString()
    @IsDefined()
    @Expose({ name: 'department_name'})
    @ApiProperty({ name: 'department_name', example: 'Human Resources', description: 'The name of the department' })
    name: string;

    @IsInt()
    @ApiProperty({ example: 2, description: 'Sorting number of the department' })
    sorting?: number;

    @IsInt()
    @IsDefined()
    @Expose({ name: 'division'})
    @ApiProperty({
        name: 'division',
        example: 'corporate services = 1, asset management = 2, marketing and operations = 3, cebu air inc = 4',
        description: 'The Division where the department belongs to'
    })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'corporate services') return 1;
        if (value === 'asset management') return 2;
        if (value === 'marketing and operations') return 3;
        if (value === 'cebu air inc') return 4;
        throw new BadRequestException(
            `Invalid division value: ${value}. Allowed values are "corporate services", "asset management", "marketing and operations", "cebu air inc".`
        );
    })
    division_id?: number;

    // @ApiProperty({ name: 'status', example: 'active', description: 'active = 1', })
    // @Expose({ name: 'status' }) // maps "status" input field to this property
    // @Transform(({ value }) => {
    //     console.log('Transforming status:', value);
    //     if (value === 'active') return 1;
    //     throw new BadRequestException(`Invalid status value: ${value}. Allowed value is active`);
    // })
    // @IsDefined()
    // stat: number;

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