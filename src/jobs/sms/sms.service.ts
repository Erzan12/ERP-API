import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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

    async sendWelcomeSMS(phoneNumber: string, username: string) {
        const message = `Hello ${username}! Welcome to Avega Bros. This is a notice that you have subscribe to sms notifications, thank you!`;

        return this.sendSMS(phoneNumber, message);
    }

    async sendOTP(phoneNumber: string, otp: string) {
        const message = `Your verification code is ${otp}. It expires in 5 minutes.`;

        return this.sendSMS(phoneNumber, message);
    }

    async sendSMS(phoneNumber: string, message: string) {
        try {
            const { data } = await firstValueFrom(
                this.httpService.post(
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
            const detail =
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof error.response === 'object' &&
                error.response !== null &&
                'data' in error.response &&
                typeof error.response.data === 'object' &&
                error.response.data !== null &&
                'detail' in error.response.data &&
                typeof error.response.data.detail === 'string'
                    ? error.response.data.detail
                    : 'Failed to send SMS';

            throw new InternalServerErrorException(
                detail,
            )
        }
    }
}
