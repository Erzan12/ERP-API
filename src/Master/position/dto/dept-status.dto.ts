import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsInt, IsString, IsDefined, IsOptional } from "class-validator";

export class ReactivatePositionDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: 'ID of the position you want to activate' })
    position_id: number;

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

export class DeactivatePositionDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 0, description: 'ID of the position you want to deactivate' })
    position_id: number;

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

