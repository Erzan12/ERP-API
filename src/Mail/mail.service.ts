import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor(private readonly configService: ConfigService) {
            this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'), //use env variable in prod
                pass: this.configService.get('SMTP_PASS') //you App Password in gmail
            },
        });
    }

    // Send email to user upon new user registration
    async sendWelcomeMail(to: string, username:string, plainPassword: string, token: string) {

        //valdiate config in your app
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP credentials are missing');
        }

        const mailOption = { 
            from : '"AV Human Resource" dummybusiness29@gmail.com',
            to,
            subject: 'Welcome to the ABAS-v3 system! Here is your Temporary password',
            html: `
                <h3>Hello ${username},</h3>
                <p>Your account has been created successfully.</p>
                <p><strong>Username:</strong> ${username} </p>
                <p><strong>Temporary Password:</strong> ${plainPassword} </p>
                <p>Please login and change your password immediately</p>
                <p>Click below to reset your password:</p>
                <a href="http://localhost:3000/auth/reset-password?token=${token}">Reset Password</a>
            `,
         };

         return await this.transporter.sendMail(mailOption);
    }

        async sendResetTokenEmail(to: string, username:string, token: string) {

        //valdiate config in your app
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP credentials are missing');
        }

        const mailOption = { 
            from : '"AV Human Resource" dummybusiness29@gmail.com',
            to,
            subject: 'Welcome to the ABAS-v3 system! Here is your reset password link!',
            html: `
                <h3>Hello ${username},</h3>
                <p>Your account has been created successfully.</p>
                <p><strong>Username:</strong> ${username} </p>
                <p>Please login and change your password immediately</p>
                <p>Click below to reset your password:</p>
                <a href="http://localhost:3000/auth/reset-password?token=${token}">Reset Password</a>
            `,
         };

         return await this.transporter.sendMail(mailOption);
    }

    // Email Automation for successful password reset
    // async successPasswordReset () {

    // }
}
