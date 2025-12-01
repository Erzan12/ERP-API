import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, IsInt} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class CreatePositionDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Software Engineer', description: 'The name of the position' })
    name: string;

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
