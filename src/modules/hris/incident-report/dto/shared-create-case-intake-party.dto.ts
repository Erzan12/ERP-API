import { ApiProperty } from '@nestjs/swagger';
import { HrErCasePartyRole } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class SharedCreateCaseIntakePartydto {
  @IsUUID()
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  employee_id: string;

  @IsEnum(HrErCasePartyRole)
  @ApiProperty({ enum: HrErCasePartyRole, example: 'respondent' })
  role: HrErCasePartyRole;
}
