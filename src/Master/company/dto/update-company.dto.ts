import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsOptional, IsDefined, IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateCompanyDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        example: '1',
        description: 'ID No. of the company',
    })
    company_id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Avega Bros. Integrated Shipping Corp',
        description: 'Update current company name',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Cebu City, Cebu',
        description: 'Update current company location',
    })
    address: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '011-63-45-123-4567',
        description: 'Update current company telephone no.'
    })
    telephone_no?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '011-63-2-1234567',
        description: 'Update current company fax no.',
    })
    fax_no?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '11-M1115-1234',
        description: 'Update current company tin no.',
    })
    company_tin?: string;

    @IsInt()
    @IsDefined()
    @IsOptional()
    @Expose({ name: 'is_top_20000' })
    @ApiProperty({
        example: 'yes or no',
        description: 'Update current company is top 20000?',
    })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'yes') return 1;
        if (value === 'no') return 0;
        throw new BadRequestException(
            `Invalid is_top_20000 value ${value}. Allowed values are "yes" or "no"`
        );
    })
    is_top_20000?: number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        example: 'ABISC',
        description: 'Update current company abbreviation',
    })
    abbreviation: string;

    @IsInt()
    @IsDefined()
    @Expose({ name: 'status' })
    @ApiProperty({
        name: 'status',
        example: 'active or inactive',
        description: 'Update current company status',
    })
    @Transform(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'active') return 1;
        if (value === 'inactive') return 0;
        throw new BadRequestException(
            `Invalid status value ${value}. Allowed values are "active" or inactive"`
        );
    })
    stat?: number;
}