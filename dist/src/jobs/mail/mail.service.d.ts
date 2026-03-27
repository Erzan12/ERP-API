import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    sendWelcomeMail(to: string, username: string, plainPassword: string, token: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendResetTokenEmail(to: string, username: string, token: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
