import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class OtpVerificationDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Sms verification otp'
    })
    otp_code: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: 'Employee UUID PK'
    })
    employeeId: string;
}