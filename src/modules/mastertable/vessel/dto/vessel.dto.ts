import { ApiProperty } from '@nestjs/swagger';
import { VesselType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateVesselDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Company UUID',
  })
  company_id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'MV Gigabites',
  })
  name: string;

  @IsNotEmpty()
  @IsEnum(VesselType, {
    message: 'Vessel type must be vessel_cargo, tugboat, and barge',
  })
  @Type(() => String)
  @ApiProperty({
    enum: VesselType,
    example: VesselType.vessel_cargo,
    description: 'The vessel type of this vessel',
  })
  type: VesselType;
}

export class CreateVesselDetailsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '999,999',
  })
  price_sold?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '950,000',
  })
  price_paid?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  length_loa?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  length_lbp?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  breadth?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  depth?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  draft?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  year_built?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  builder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  place_built?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  jap_dwt?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  bale_capacity?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  grain_capacity?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  hatch_size?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  hatch_type?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  hull_type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  hull_number: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  fuel_type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  gearbox_ratio?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  year_last_drydock?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  place_last_drydock?: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ example: "12.50" })
  // phil_dwt?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 1000.4,
  })
  phil_dwt?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '998',
  })
  gross_tonnage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  net_tonnage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  main_engine?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  main_engine_rating?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  main_engine_actual_rating?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  model_serial_no?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  estimated_fuel_consumption?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  bow_thrusters?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  propeller?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  call_sign?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  imo_no?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  mmsi_no?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2026-04-10',
    description: 'Date end of the employee leave request',
  })
  maiden_voyage?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  min_main_engine_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  max_main_engine_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  auxillary_engine_1_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  auxillary_engine_2_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  auxillary_engine_3_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  generator_set_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  crane_rating: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: true,
  })
  is_coupled_generator?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 90,
  })
  min_service_knots?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  max_service_knots?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  bank_account_number?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  bank_account_name?: string;
}

export class CreateVesselWithDetailsDto {
  @ApiProperty({ type: () => CreateVesselDto })
  @ValidateNested()
  @Type(() => CreateVesselDto)
  vessel: CreateVesselDto;

  @ApiProperty({ type: () => CreateVesselDetailsDto })
  @ValidateNested()
  @Type(() => CreateVesselDetailsDto)
  vessel_details: CreateVesselDetailsDto;
}

export class UpdateVesselDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Company UUID',
  })
  company_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'MV Gigabites',
  })
  name?: string;

  @IsOptional()
  @IsEnum(VesselType, {
    message: 'Vessel type must be vessel_cargo, tugboat, and barge',
  })
  @Type(() => String)
  @ApiProperty({
    enum: VesselType,
    example: VesselType.vessel_cargo,
    description: 'The vessel type of this vessel',
  })
  type?: VesselType;
}

export class UpdateVesselDetailsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '999,999',
  })
  price_sold?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '950,000',
  })
  price_paid?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  length_loa?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  length_lbp?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  breadth?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  depth?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  draft?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  year_built?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  builder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  place_built?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  jap_dwt?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  bale_capacity?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  grain_capacity?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  hatch_size?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  hatch_type?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  hull_type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  hull_number?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  fuel_type?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  gearbox_ratio?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  year_last_drydock?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  place_last_drydock?: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ example: "12.50" })
  // phil_dwt?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 1000.4,
  })
  phil_dwt?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '998',
  })
  gross_tonnage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  net_tonnage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  main_engine?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  main_engine_rating?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  main_engine_actual_rating?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  model_serial_no?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  estimated_fuel_consumption?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  bow_thrusters?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  propeller?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  call_sign?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  imo_no?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  mmsi_no?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2026-04-10',
    description: 'Date end of the employee leave request',
  })
  maiden_voyage?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  min_main_engine_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  max_main_engine_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  auxillary_engine_1_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  auxillary_engine_2_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  auxillary_engine_3_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  generator_set_rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  crane_rating: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: true,
  })
  is_coupled_generator?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 90,
  })
  min_service_knots?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 100,
  })
  max_service_knots?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  bank_account_number?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  bank_account_name?: string;
}

export class UpdateVesselWithDetailsDto {
  @ApiProperty({ type: () => UpdateVesselDto })
  @ValidateNested()
  @Type(() => UpdateVesselDto)
  update_vessel: UpdateVesselDto;

  @ApiProperty({ type: () => UpdateVesselDetailsDto })
  @ValidateNested()
  @Type(() => UpdateVesselDetailsDto)
  update_vessel_details: UpdateVesselDetailsDto;
}
