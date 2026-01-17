import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsDefined, IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserLocationDto {
    @IsDefined()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: 'ID of the User Location you want to update' })
    user_location_id: number;

    @IsString()
    @ApiProperty({ example: 'New User Location', description: 'If you want to update the User Location name'})
    location_name?: string;

    @IsString()
    @ApiProperty({ example: 'New User Location address', description: 'If you want to update the User Location address'})
    address?: string;

    @IsInt()
    @IsDefined()
    @Expose({ name: 'status' }) //maps "status" input field to this property
    @ApiProperty({
        name: 'status',
        example: 'active or inactive',
        description: 'active = 1, inactive = 0'
    })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'active') return 1;
        if (value === 'inactive') return 2;
        throw new BadRequestException(
            `Invalid status value: ${value}. Allowed vales are "active" or "inactive".`
        );
    })
    stat?: number;
}