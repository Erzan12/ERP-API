import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ErCasePaginationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: '' })
  search?: string;

  // @IsOptional()
  // @IsString()
  // @ApiPropertyOptional({ default: '' })
  // status?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'created_at', default: 'created_at' })
  sortBy: string = 'created_at';

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

export class ErCaseArticlePaginationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: '' })
  search?: string;

  // @IsOptional()
  // @IsString()
  // @ApiPropertyOptional({ default: '' })
  // status?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'created_at', default: 'created_at' })
  sortBy: string = 'created_at';

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

export class ErCaseViolationPaginationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: '' })
  search?: string;

  // @IsOptional()
  // @IsString()
  // @ApiPropertyOptional({ default: '' })
  // status?: string;
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: 'Article UUID',
  })
  article_id: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({ example: 1 })
  section: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'created_at', default: 'created_at' })
  sortBy: string = 'created_at';

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

export class ErCaseTypesOfOffensePaginationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: '' })
  search?: string;

  // @IsOptional()
  // @Transform(({ value }) => {
  //   if (value === 'true') return true;
  //   if (value === 'false') return false;
  //   return value;
  // })
  // @IsBoolean()
  // @ApiPropertyOptional({ default: '' })
  // status?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiPropertyOptional()
  status?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'created_at', default: 'created_at' })
  sortBy: string = 'created_at';

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
