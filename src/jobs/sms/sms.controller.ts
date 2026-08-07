import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManualSmsNotificationPreferenceDto, SmsNotificationPreferenceDto } from 'src/modules/hris/employee-masterlist/dto/sms.dto';
import { OtpVerificationDto } from 'src/modules/hris/employee-masterlist/dto/otp.dto';

@ApiTags('Sms Module - Employee Sms Registration')
@Controller({ path: 'sms', version: '2' })
export class SmsController {
    constructor(
        private readonly smsService: SmsService,
    ) {}

    @Post('employees/sms-notification-registration')
    @ApiBody({
        type: SmsNotificationPreferenceDto,
        description: 'Payload to register employee to sms notifications',
    })
    @ApiOperation({ summary: 'Employee SMS Registration' })
    smsNotificationRegistration(@Body() dto: ManualSmsNotificationPreferenceDto) {
        return this.smsService.employeeManualSmsNotificationRegistration(
            dto,
        );
    }

    @Post('employees/sms-notification-registration/verify-otp')
    @ApiOperation({ summary: 'Verify otp of employee' })
    verifyEmployeeSmsOtp(@Body() dto: OtpVerificationDto) {
        return this.smsService.employeeSmsVerify(dto);
    }
}
