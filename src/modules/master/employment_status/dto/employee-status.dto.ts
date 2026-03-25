import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEmployeeStatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'TERMINATED',
    description: 'The code of the employee status',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Terminated',
    description: 'Proper label of the employee status code',
  })
  label: string;
}

export class UpdateEmployeeStatusDto extends PartialType(
  CreateEmployeeStatusDto,
) {}
