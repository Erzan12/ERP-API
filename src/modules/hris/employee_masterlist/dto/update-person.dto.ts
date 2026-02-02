import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  CivilStatus,
  Gender,
} from 'src/components/decorators/global.enums.decorator';

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  @IsEnum(Gender, { message: 'Gender must be male and female' })
  @Type(() => String)
  gender?: Gender;

  @IsOptional()
  @Type(() => String)
  @IsEnum(CivilStatus, {
    message: 'Civil status must be single, married, separated, or widowed',
  })
  @ApiProperty({
    enum: CivilStatus,
    example: CivilStatus.Single,
    description: 'Civil Status of the employee',
  })
  civil_status?: CivilStatus;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'sample@gmail.com',
    description: 'Email of the employee',
  })
  email: string;
}
