import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDefined,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  @ApiProperty({
    example: 'Cebu Air Inc',
    description: 'The name of the division',
  })
  name: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'Division UUID',
    description: 'ID number of the division head it belongs to',
  })
  division_head_id?: string;

  // @IsInt()
  // @IsDefined()
  // @Expose({ name: 'status' }) // maps "status" input field to this property
  // @ApiProperty({
  //   name: 'status',
  //   example: 'active',
  //   description: 'active = 1, inactive = 0',
  // })
  // @Transform(({ value }) => {
  //   console.log('Transforming status:', value);
  //   if (value === 'active') return 1;
  //   if (value === 'inactive') return 0;
  //   throw new BadRequestException(
  //     `Invalid status value: ${value}. Allowed values are "active" or "inactive".`,
  //   );
  // })
  // stat: number;
}

export class UpdateDivisionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'New Division Name',
    description: 'If you want to update the Division name',
  })
  name: string;

  @IsOptional()
  @IsBoolean()
  @IsDefined()
  @ApiProperty({
    example: 'true or false',
    description: 'Update the status of the division',
  })
  isActive?: boolean;
}
