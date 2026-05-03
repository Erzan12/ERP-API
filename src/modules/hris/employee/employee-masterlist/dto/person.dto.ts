import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CivilStatus, Gender } from '@prisma/client';


export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Juan',
    description: 'First name of the employee',
  })
  first_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Hindi',
    description: 'Middle name of the employee but it is optional',
  })
  middle_name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Tamad',
    description: 'Last name of the employee',
  })
  last_name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2025-07-10',
    description: 'Date of birth of the employee',
  })
  date_of_birth: string;

  @Type(() => String)
  @IsString()
  @ApiProperty({
    enum: Gender,
    example: Gender.male,
    description: 'Gender of the employee',
  })
  @IsEnum(Gender, { message: 'Gender must be male and female' })
  gender: Gender;

  @Type(() => String)
  @ApiProperty({
    enum: CivilStatus,
    example: CivilStatus.single,
    description: 'Civil Status of the employee',
  })
  @IsEnum(CivilStatus, {
    message: 'Civil status must be single, married, separated, or widowed',
  })
  civil_status: CivilStatus;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'sample@gmail.com',
    description: 'Email of the employee',
  })
  email: string;
}

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
