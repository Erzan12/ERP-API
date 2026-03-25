import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: '' })
  search?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'id', default: 'id' })
  sortBy: string = 'id';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'desc', default: 'desc' })
  order: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({ example: 1, default: 1 })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({ example: 10, default: 10 })
  perPage: number = 10;
}
