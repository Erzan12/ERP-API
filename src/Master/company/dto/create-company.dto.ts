import { IsInt, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsInt()
    @IsNotEmpty()
    telephone_no: number;

    @IsInt()
    @IsNotEmpty()
    tax_identification_no: number;

    @IsString()
    @IsNotEmpty()
    abbreviation: string;

    @IsString()
    @IsNotEmpty()
    company_code: string;

    @IsBoolean()
    @IsNotEmpty()
    is_top_20000?: boolean;
}