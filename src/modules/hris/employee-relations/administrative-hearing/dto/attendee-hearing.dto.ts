import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AttendeeHearingDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'PK UUID of the hearing',
  })
  hearing_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Name of the Hearing Committee Attendee',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Position of the Hearing Committee Attendee',
  })
  position: string;
}
