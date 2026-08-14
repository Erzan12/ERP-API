import { ApiProperty } from '@nestjs/swagger';
import { CreateCaseDto } from './create-case.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCaseWithDetailsDto {
  @ApiProperty({ type: () => CreateCaseDto })
  @ValidateNested()
  @Type(() => CreateCaseDto)
  case: CreateCaseDto;

  // @ApiProperty({ type: () => CreateCasePartyDto})
  // @ValidateNested()
  // @Type(() => CreateCasePartyDto)
  // party: CreateCasePartyDto[];
}
