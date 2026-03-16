import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsInt, IsDefined, IsUUID, IsOptional } from 'class-validator';

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
    example:'Division PK UUID',
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
    description: 'The division where the department belongs to'
  })
  division_id?: string;

  @IsOptional()
  @IsInt()
  @IsDefined()
  @Expose({ name: 'status' }) // maps "status" input field to this property
  @ApiProperty({
    name: 'status',
    example: 'active or inactive',
    description: 'active = 1, inactive = 0',
  })
  @Transform(({ value }) => {
    console.log('Transforming status:', value);
    if (value === undefined || value === null) return undefined; //allow missing
    if (value === 'active') return 1;
    if (value === 'inactive') return 0;
    throw new BadRequestException(
      `Invalid status value: ${value}. Allowed values are "active" or "inactive".`,
    );
  })
  stat?: number;
}
