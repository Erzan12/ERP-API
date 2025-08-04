import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, IsInt} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class CreatePositionDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Software Engineer', description: 'The name of the position' })
    name: string;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty({ example: 2, description: 'ID of the department this position belongs to' })
    department_id: number;

    @IsInt()
    @IsNotEmpty()
    @Expose({ name: 'status' }) // maps "status" input field to this property
    @ApiProperty({ name: 'status', example: 'active', description: 'active = 1', })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'active') return 1;
        throw new BadRequestException(`Invalid status value: ${value}. Allowed value is active`);
    })
    @IsDefined()
    stat: number;
}
