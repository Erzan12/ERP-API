import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class NoShowHearingDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Party is no show or did not attend the hearing schedule',
  })
  remarks?: string;
}
