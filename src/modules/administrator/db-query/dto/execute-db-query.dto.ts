import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteDbQueryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    example: 'ALTER TABLE "Module" ADD COLUMN "test" TEXT;',
    description: 'Manual db query operation',
  })
  sql: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    example: 'this is to add new column for Module table',
    description: 'The purpose of you db query',
  })
  purpose: string;
}
