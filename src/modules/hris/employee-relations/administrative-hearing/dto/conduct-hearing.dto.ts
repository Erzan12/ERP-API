import { ApiProperty } from "@nestjs/swagger";
import { HrErHearingChannel } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ConductHearingDto {
    @IsEnum(HrErHearingChannel)
    @ApiProperty({ 
        enum: HrErHearingChannel,
        description: 'Channel the hearing was actually conducted through',
    })
    channel: HrErHearingChannel;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    minutes_file_url?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    remarks?: string;
}