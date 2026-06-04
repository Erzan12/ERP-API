import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'mail.avegabros.com',
      // port: 587,
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'), 
      },
    });
  }

  // Send email to user upon new user registration
  async sendWelcomeMail(
    to: string,
    username: string,
    plainPassword: string,
    token: string,
  ) {
    //valdiate config in your app
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are missing');
    }

    const mailOption = {
      from: 'AV Human Resource <noreply@avegabros.com>',
      to,
      subject: 'Welcome to the ABAS-v3 system!',
      html: `
                <h3>Hello ${username},</h3>
                <p>Your account has been created successfully.</p>

                <p><strong>Username:</strong> ${username} </p>
                <!-- <p><strong>Temporary Password:</strong> ${plainPassword} </p> -->

                <p>Please login and change your password immediately</p>
                <p>Click below to reset your password:</p>

                <a href="http://localhost:3000/auth/reset-password?token=${token}">
                  Reset Password
                </a>
            `,
    };

    return await this.transporter.sendMail(mailOption);
  }

  async sendResetTokenEmail(to: string, username: string, token: string) {
    //valdiate config in your app
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are missing');
    }

    const mailOption = {
      from: `"Avega Bros HRMS" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject:
        'Welcome to the ABAS-v3 system! Here is your reset password link!',
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

  async sendOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Avega Bros HRMS" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject: 'Password Reset OTP',
          html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>

          <p>We received a request to reset your password.</p>

          <p>Your One-Time Password (OTP) is:</p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              color: #0d6efd;
              margin: 20px 0;
            "
          >
            ${otp}
          </div>

          <p>This OTP will expire in <strong>10 minutes</strong>.</p>

          <p>If you did not request a password reset, you may safely ignore this email.</p>

          <br />
          <p>Regards,</p>
          <p><strong>Avega Bros HRMS</strong></p>
        </div>
      `,
    });
  }
}
