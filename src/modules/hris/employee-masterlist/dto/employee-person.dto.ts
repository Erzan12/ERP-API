import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePersonDto, UpdatePersonDto } from './person.dto';
import { SmsNotificationPreferenceDto } from './sms.dto';

export class CreateEmployeeWithDetailsDto {
  //wrapper dto for nested dto
  @ApiProperty({ type: () => CreatePersonDto }) // to load or map the example value in createPersonDto ApiProperty
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

  @ApiProperty({ type: () => CreateEmployeeDto }) // to load or map the example value in createEmpoyeeDto ApiProperty
  @ValidateNested()
  @Type(() => CreateEmployeeDto)
  employee: CreateEmployeeDto;

  @ApiProperty({ type: () => SmsNotificationPreferenceDto }) // to load or map the example value in createEmpoyeeDto ApiProperty
  @ValidateNested()
  @Type(() => SmsNotificationPreferenceDto)
  sms: SmsNotificationPreferenceDto;
}

export class UpdateEmployeeWithDetailsDto {
  //wrapper dto for nested dto
  @ApiProperty({ type: () => UpdatePersonDto }) // to load or map the example value in createPersonDto ApiProperty
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person: UpdatePersonDto;

  @ApiProperty({ type: () => UpdateEmployeeDto }) // to load or map the example value in createEmpoyeeDto ApiProperty
  @ValidateNested()
  @Type(() => UpdateEmployeeDto)
  employee: UpdateEmployeeDto;

  @ApiProperty({ type: () => SmsNotificationPreferenceDto }) // to load or map the example value in createEmpoyeeDto ApiProperty
  @ValidateNested()
  @Type(() => SmsNotificationPreferenceDto)
  sms: SmsNotificationPreferenceDto;
}
