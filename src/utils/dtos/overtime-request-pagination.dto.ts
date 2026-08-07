import { ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { OvertimeStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class OvertimeRequestsPaginationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: '' })
  search?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: '' })
  status?: string;

  // @IsOptional()
  // @IsBoolean()
  // @Transform(({ value }) => value === 'true')
  // @ApiPropertyOptional({ default: '' })
  // is_active?: boolean;

  // @IsOptional()
  // @IsString()
  // @ApiPropertyOptional({
  //   example: '18:00:00',
  //   description: 'Filter records with time_from >= this time',
  // })
  // time_from?: string;

  // @IsOptional()
  // @IsString()
  // @ApiPropertyOptional({
  //   example: '22:00:00',
  //   description: 'Filter records with time_to <= this time',
  // })
  // time_to: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '2026-07-01',
    description: 'Filter record from date filed',
  })
  date_filed_from?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '2026-07-20',
    description: 'Filter record up to',
  })
  date_filed_to?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: '' })
  employee_id?: string;

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

  @IsOptional()
  // @Transform(({ value }) => {
  //   if (!value) return [];
  //   return Array.isArray(value) ? value : value.split(',');
  // })\
  @Transform(({ value }) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value;
    }

    return value.split(',');
  })
  @IsArray()
  @IsEnum(OvertimeStatus, { each: true })
  @ApiPropertyOptional({
    example: ['for_verification', 'for_approval'],
    isArray: true,
    enum: OvertimeStatus,
  })
  show_by_status?: OvertimeStatus[];
}

// export class OvertimeRequestStatusPaginationDto {
//   @IsOptional()
//   // @Transform(({ value }) => {
//   //   if (!value) return [];
//   //   return Array.isArray(value) ? value : value.split(',');
//   // })\
//   @Transform(({ value }) => {
//     if (!value) return [];

//     if (Array.isArray(value)) {
//       return value;
//     }

//     return value.split(',');
//   })
//   @IsArray()
//   @IsEnum(OvertimeStatus, { each: true })
//   @ApiPropertyOptional({
//     example: ['for_verification', 'for_approval'],
//     isArray: true,
//     enum: OvertimeStatus,
//   })
//   show_by_status?: OvertimeStatus[];
// }
