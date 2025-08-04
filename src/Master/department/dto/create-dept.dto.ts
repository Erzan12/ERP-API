import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, IsDefined } from 'class-validator';

export class CreateDepartmentDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Human Resources', description: 'The name of the department' })
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({ example: 2, description: 'ID of the division where the department belongs to' })
    division_id: number;

    @ApiProperty({ name: 'status', example: 'active', description: 'active = 1', })
    @Expose({ name: 'status' }) // maps "status" input field to this property
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'active') return 1;
        throw new BadRequestException(`Invalid status value: ${value}. Allowed value is active`);
    })
    @IsDefined()
    stat: number;
}