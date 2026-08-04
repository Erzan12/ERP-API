import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, ValidateIf } from "class-validator";

export class SmsNotificationPreferenceDto {
    // @IsUUID()
    // @IsOptional()
    // @ApiProperty({
    //     example: 'Employee UUID'
    // })
    // employee_id?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: 'true or false'
    })
    subscribe?: boolean;

    @ValidateIf(o => o.enabled)
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Employee Phone Number'
    })
    @Matches(/^09\d{9}$/, {
        message: 'Mobile number must be a valid Philippine mobile number.',
    })
    mobile_number: string;
}

export class ManualSmsNotificationPreferenceDto {
    // @IsUUID()
    // @IsOptional()
    // @ApiProperty({
    //     example: 'Employee UUID'
    // })
    // employee_id?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: 'true or false'
    })
    subscribe?: boolean;

    @ValidateIf(o => o.enabled)
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Employee Phone Number'
    })
    @Matches(/^09\d{9}$/, {
        message: 'Mobile number must be a valid Philippine mobile number.',
    })
    mobile_number: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: 'Employee UUID PK'
    })
    employee_id: string;
}