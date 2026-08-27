import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { SharedCreateCaseIntakePartydto } from "src/modules/hris/incident-report/dto/shared-create-case-intake-party.dto";

export class CreateEmployeeReportDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    incident_location_id: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ example: '2026-08-20T09:00:00.000Z' })
    incident_date: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, example: 'The personnel stole the crane' })
    incident_narrative?: string;

    @ValidateNested({ each: true })
    @Type(() => SharedCreateCaseIntakePartydto)
    @ArrayMinSize(1)
    @ApiProperty({ type: [SharedCreateCaseIntakePartydto] })
    parties: SharedCreateCaseIntakePartydto[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'What kind of suspicious activity or accident happened' })
    subject: string;
}

export class UpdateEmployeeReportDto {
    @IsUUID()
    @IsOptional()
    @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    incident_location_id?: string;

    @IsDateString()
    @IsOptional()
    @ApiPropertyOptional({ example: '2026-08-20T09:00:00.000Z' })
    incident_date?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ required: false, example: 'The personnel stole the crane' })
    incident_narrative?: string;

    @ValidateNested({ each: true })
    @Type(() => SharedCreateCaseIntakePartydto)
    @IsOptional()
    @ArrayMinSize(1)
    @ApiPropertyOptional({ type: [SharedCreateCaseIntakePartydto] })
    parties?: SharedCreateCaseIntakePartydto[];

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: 'What kind of suspicious activity or accident happened' })
    subject?: string;
}