import { ApiProperty } from '@nestjs/swagger';
import { HrErHearingChannel } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ConductHearingDto {
  @IsEnum(HrErHearingChannel)
  @ApiProperty({
    enum: HrErHearingChannel,
    description: 'Channel the hearing was actually conducted through',
  })
  channel: HrErHearingChannel;
}
