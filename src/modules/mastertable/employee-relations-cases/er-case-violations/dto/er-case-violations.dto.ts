import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateErCaseViolationDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: 'Article UUID',
  })
  article_id: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 3,
  })
  section: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Failure to punch time records or login or out',
  })
  behavior: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'A',
  })
  category: string;
}

export class UpdateErCaseViolationDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'Article UUID',
  })
  article_id?: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 3,
  })
  section?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Failure to punch time records or login or out',
  })
  behavior?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'A',
  })
  category?: string;
}
