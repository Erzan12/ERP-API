import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ApplicationSource,
  ApplicationStatus,
} from 'src/utils/decorators/global.enums.decorator';

export class CreateApplicantDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Job/Career posting PK UUID',
    description: 'UUID of career posting',
  })
  career_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Juan',
    description: 'First name of applicant',
  })
  first_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Doe',
    description: 'Middlename can be optional',
  })
  middle_name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Dee',
    description: 'Last name of the applicant',
  })
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'juandoe@gmail.com',
    description: 'Email of the applicant',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '09633416290',
    description: 'Mobile no. of the applicant',
  })
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ApplicationSource, {
    message:
      'Application Source must be company_website, walk_in, referral, linkedIn, jobstreet',
  })
  @Type(() => String)
  @ApiProperty({
    enum: ApplicationSource,
    example: ApplicationSource.COMPANY_WEBSITE,
    description: 'The application source of the applicant',
  })
  application_source: ApplicationSource;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ApplicationStatus, {
    message:
      'Application Status must be applied, screening, for_interview, accepted, rejected, onboarding',
  })
  @Type(() => String)
  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.FOR_INTERVIEW,
    description: 'The status of application of the applicant',
  })
  application_status: ApplicationStatus;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-03-05',
    description: 'The date of application of the applicant',
  })
  date_applied: string;
}

export class UpdateApplicantDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: 'Job/Career posting PK UUID',
    description: 'UUID of career posting',
  })
  career_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Juan',
    description: 'First name of applicant',
  })
  first_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Doe',
    description: 'Middlename can be optional',
  })
  middle_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Dee',
    description: 'Last name of the applicant',
  })
  last_name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: 'juandoe@gmail.com',
    description: 'Email of the applicant',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '09633416290',
    description: 'Mobile no. of the applicant',
  })
  mobile_number?: string;

  @IsString()
  @IsOptional()
  @IsEnum(ApplicationSource, {
    message:
      'Application Source must be company_website, walk_in, referral, linkedIn, jobstreet',
  })
  @Type(() => String)
  @ApiProperty({
    enum: ApplicationSource,
    example: ApplicationSource.COMPANY_WEBSITE,
    description: 'The application source of the applicant',
  })
  application_source?: ApplicationSource;

  @IsString()
  @IsOptional()
  @IsEnum(ApplicationStatus, {
    message:
      'Application Status must be applied, screening, for_interview, accepted, rejected, onboarding',
  })
  @Type(() => String)
  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.FOR_INTERVIEW,
    description: 'The status of application of the applicant',
  })
  application_status?: ApplicationStatus;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2026-03-05',
    description: 'The date of application of the applicant',
  })
  date_applied?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: 'true or false',
    description: 'If this application is active',
  })
  isActive?: boolean;
}
