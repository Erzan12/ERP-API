import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateSecurityClearanceDto {
  @IsInt()
  @Min(1)
  @Max(10)
  @ApiProperty({
    example: 1,
    description:
      '1 is the lowest level of security clearance while 9 is the highest',
  })
  new_level: number;
}
