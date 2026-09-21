import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsDefined,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsDefined()
  // @Expose({ name: 'department_name' })
  @ApiProperty({
    // name: 'department_name',
    example: 'Human Resources',
    description: 'The name of the department',
  })
  name: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 2, description: 'Sorting number of the department' })
  sorting?: number;

  @IsUUID()
  @ApiProperty({
    example: 'Division PK UUID',
    description: 'The Division where the department belongs to',
  })
  division_id: string;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'New Department name',
    description: 'If you want to update the Department name',
  })
  name?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 2, description: 'Sorting number of the department' })
  sorting?: number;

  @IsOptional()
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: 'Division PK UUID',
    description: 'The division where the department belongs to',
  })
  division_id?: string;

  @IsOptional()
  @IsBoolean()
  @IsDefined()
  @ApiProperty({
    example: 'true or false',
    description: 'Update the status of a department',
  })
  is_active?: boolean;
}
