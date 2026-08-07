import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpPurposeTemplate, OtpVerification } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { OtpVerificationDto } from 'src/modules/hris/employee-masterlist/dto/otp.dto';
import { ManualSmsNotificationPreferenceDto } from 'src/modules/hris/employee-masterlist/dto/sms.dto';
import { EmployeeMasterlistService } from 'src/modules/hris/employee-masterlist/employee-masterlist.service';
import { generateOtp, getOtpExpiration } from 'src/utils/constants/otp-verification.constants';

interface SmsApiResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

interface SmsErrorResponseData {
  detail?: string;
}

@Injectable()
export class SmsService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  private readonly logger = new Logger(EmployeeMasterlistService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiUrl = this.configService.getOrThrow<string>('SMS_API_URL');
    this.apiKey = this.configService.getOrThrow<string>('SMS_API_KEY');

    if (!this.apiUrl || !this.apiKey) {
      throw new Error('SMS configuration is missing');
    }
  }

  private extractErrorDetail(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object' &&
      (error as { response?: unknown }).response !== null
    ) {
      const response = (error as { response: { data?: unknown } }).response;
      const data = response.data as SmsErrorResponseData | undefined;
      if (data && typeof data.detail === 'string') {
        return data.detail;
      }
    }
    return 'Failed to send SMS';
  }

  async sendWelcomeSMS(
    phoneNumber: string,
    username: string,
    employeeId: string,
  ): Promise<SmsApiResponse> {
    const message = `Hello ${username}! Welcome to Avega Bros. This is a notice that you are now enrolled to the system you can now log in to set your password, Here is your username: ${employeeId} thank you!`;
    return this.sendSMS(phoneNumber, message);
  }

  async sendSmsNotificationSubscription(
    phoneNumber: string,
    username: string,
  ): Promise<SmsApiResponse> {
    const message = `Hello ${username}! Welcome to Avega Bros. This is a notice that you have subscribe to sms notifications, thank you!`;
    return this.sendSMS(phoneNumber, message);
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<SmsApiResponse> {
    const message = `Your verification code is ${otp}. It expires in 5 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  async sendSMS(phoneNumber: string, message: string): Promise<SmsApiResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<SmsApiResponse>(
          `${this.apiUrl}/send-sms`,
          {
            phone_number: phoneNumber,
            message,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': this.apiKey,
            },
          },
        ),
      );

      return data;
    } catch (error) {
      const detail = this.extractErrorDetail(error);
      throw new InternalServerErrorException(detail);
    }
  }

  // Module API's
  async employeeManualSmsNotificationRegistration(
      dto: ManualSmsNotificationPreferenceDto,
  ) {
      const result = await this.prisma.$transaction(async (tx) => {
      const existingEmployee = await tx.employee.findUnique({
          where: { id: dto.employee_id },
          include: {
          user: true,
          person: true,
          },
      });

      if (!existingEmployee) {
          throw new NotFoundException('Employee does not exist.');
      }

      const existingSubscription = await tx.hrEmployeeSmsSubscription.findFirst(
          {
          where: {
              employee_id: dto.employee_id,
          },
          },
      );

      if (
          existingSubscription?.mobile_number_id &&
          existingSubscription?.is_enabled === true &&
          existingSubscription?.is_verified === true
      ) {
          throw new BadRequestException(
          'Employee SMS Subcription already enabled',
          );
      }

      await tx.mobileNumber.create({
          data: {
          employee_id: existingEmployee?.id,
          mobile_number: dto.mobile_number,
          is_primary: true,
          is_verified: false,
          },
      });

      // const employeeSmsRegistration = await this.prisma.hrEmployeeSmsSubscription.create({
      //   data: {
      //     employee_id: employeeId,
      //     mobile_number_id: mobile.id,
      //     is_enabled: false,
      //     is_verified: false,
      //     template: 'otp',
      //     created_by: existingEmployee?.user?.id,
      //   },
      // });

      const otp = await tx.otpVerification.create({
        data: {
          employee_id: dto.employee_id,
          code: generateOtp(),
          purpose: OtpPurposeTemplate.register_employee,
          expires_at: getOtpExpiration(),
          created_at: new Date(),
        },
      });

      return {
          otp,
        };
      });

      try {
        await this.sendOTP(dto.mobile_number, result.otp.code);
      } catch (e) {
        console.error('OTP SMS failed', e);
      }

      return {
      status: 'success',
      message:
          'Employee Sms Notification registered, check your SMS inbox for OTP code to verify',
      };
  }

  async employeeSmsVerify(dto: OtpVerificationDto) {
    const { mobile, otpRecord } = await this.prisma.$transaction(async (tx) => {
      // Find OTP
      const otpRecord = await tx.otpVerification.findFirst({
          where: {
          code: dto.otp_code,
          purpose: OtpPurposeTemplate.register_employee,
          is_used: false,
          employee_id: dto.employee_id,
          expires_at: {
              gt: new Date(),
          },
          },
          orderBy: {
          created_at: 'desc',
          },
          include: {
          employee: {
              include: {
              sms_subscription: true,
              user: true,
              person: true,
              },
          },
          },
      });

      if (!otpRecord) {
          throw new BadRequestException('Invalid OTP.');
      }

      // Mark OTP as used
      await tx.otpVerification.update({
          where: {
          id: otpRecord.id,
          },
          data: {
          is_used: true,
          used_at: new Date(),
          },
      });

      // Find unverified mobile number
      const existingMobile = await tx.mobileNumber.findFirst({
          where: {
          employee_id: dto.employee_id,
          is_verified: false,
          },
          orderBy: {
          created_at: 'desc',
          },
      });

      if (!existingMobile) {
          throw new NotFoundException('Mobile number not found.');
      }

      // Verify mobile number
      const mobile = await tx.mobileNumber.update({
          where: {
          id: existingMobile.id,
          },
          data: {
          is_verified: true,
          verified_at: new Date(),
          },
      });

      // Create or update SMS subscription
      const subscription = await tx.hrEmployeeSmsSubscription.findFirst({
          where: {
          employee_id: dto.employee_id,
          },
      });

      if (subscription) {
          await tx.hrEmployeeSmsSubscription.update({
          where: {
              id: subscription.id,
          },
          data: {
              mobile_number_id: mobile.id,
              is_verified: true,
              is_enabled: true,
              verified_at: new Date(),
          },
          });

          await tx.employeeNotificationPreference.update({
          where: {
              employee_id: dto.employee_id,
          },
          data: {
              sms_enabled: true,
          },
          });
      } else {
          await tx.hrEmployeeSmsSubscription.create({
          data: {
              employee_id: dto.employee_id,
              mobile_number_id: mobile.id,
              is_verified: true,
              is_enabled: true,
              template: 'otp',
              created_by: otpRecord.employee.user_id,
              verified_at: new Date(),
          },
          });

          await tx.employeeNotificationPreference.create({
          data: {
              employee_id: dto.employee_id,
              sms_enabled: true,
          },
          });
      }

      return { mobile, otpRecord };
    });

    // Outside the transaction — DB work is already committed.
    try {
        await this.sendSmsNotificationSubscription(
            mobile.mobile_number,
            otpRecord.employee.person.first_name,
        );
    } catch (err) {
        // Log it, maybe flag the subscription for retry — but don't
        // roll back the OTP/verification/subscription records.
        this.logger.error('Welcome SMS failed after OTP verification', err);
    }

    return {
        status: 'success',
        message: 'OTP verified successfully.',
    };
  }
}
