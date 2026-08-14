import { ApiProperty } from '@nestjs/swagger';

export class SkippedPartyDto {
  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  partyId: string;

  @ApiProperty({ example: 'Still awaiting written explanation.' })
  reason: string;
}

export class AdvanceStageResponseDto {
  @ApiProperty({
    type: [String],
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
  })
  advanced: string[];

  @ApiProperty({ type: [SkippedPartyDto] })
  skipped: SkippedPartyDto[];
}
