import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.getOrThrow<string>('SMS_API_URL');
    this.apiKey = this.configService.getOrThrow<string>('SMS_API_KEY');

    if (!this.apiUrl || !this.apiKey) {
      throw new Error('SMS configuration is missing');
    }
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
}
