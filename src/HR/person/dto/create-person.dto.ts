import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { CivilStatus, Gender } from '../../../Components/decorators/global.enums.decorator';

export class CreatePersonDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsOptional()
    middle_name?: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    @IsString()
    date_of_birth: string;

    @Type(() => String)
    @IsString()
    @IsEnum(Gender, { message: 'Gender must be male and female'})
    gender: Gender;

    @Type(() => String)
    @IsEnum(CivilStatus, { message : 'Civil status must be single, married, separated, or widowed'})
    civil_status: CivilStatus;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}