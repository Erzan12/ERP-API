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
    // plainPassword: string,
    token: string,
  ) {
    //valdiate config in your app
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are missing');
    }

    const setupUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    const mailOption = {
      from: `"Avega Bros Integrated Shipping Corp." <${this.configService.get('SMTP_USER')}>`,
      to,
      subject: 'Welcome to Avega Bros Integrated Shipping Corp.',
      html: `
        <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 20px;">

                <table width="600" cellpadding="0" cellspacing="0"
                  style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:#c1121f;padding:20px;">
                      <img
                        src="https://minio-api.abas.ph/company-logo/av.png"
                        alt="ABAS"
                        style="
                          max-height:60px;
                          display:block;
                        "
                      />
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding:40px;">

                      <h2 style="margin-top:0;color:#333;">
                        Welcome to Avega Bros Integrated Shipping Corp.
                      </h2>

                      <p style="color:#555;line-height:1.6;">
                        Hello <strong>${username}</strong>,
                      </p>

                      <p style="color:#555;line-height:1.6;">
                        Your employee account has been successfully created.
                      </p>

                      <p style="color:#555;line-height:1.6;">
                        To activate your account and create your password,
                        please click the button below.
                      </p>

                      <div style="text-align:center;margin:30px 0;">
                        <a
                          href="${setupUrl}"
                          style="
                            background:#dc2626;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 28px;
                            border-radius:6px;
                            display:inline-block;
                            font-weight:bold;
                          "
                        >
                          Set Password
                        </a>
                      </div>

                      <p style="color:#555;line-height:1.6;">
                        If the button does not work, copy and paste the following
                        link into your browser:
                      </p>

                      <p style="
                        word-break:break-all;
                        color:#0d6efd;
                        font-size:14px;
                      ">
                        ${setupUrl}
                      </p>

                      <p style="color:#555;line-height:1.6;">
                        For security purposes, this link will expire after a
                        limited time.
                      </p>

                      <p style="color:#555;line-height:1.6;">
                        If you were not expecting this email, please contact your
                        HR administrator.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="
                      background:#f8f9fa;
                      padding:20px;
                      text-align:center;
                      color:#6c757d;
                      font-size:12px;
                    ">
                      © ${new Date().getFullYear()} Avega Bros Integrated Shipping Corp.<br />
                      This is an automated message. Please do not reply to this
                      email.
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </div>
      `,
    };

    return await this.transporter.sendMail(mailOption);
  }

  async sendResetTokenEmail(to: string, username: string, token: string) {
    //valdiate config in your app
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are missing');
    }

    const resetUrl = 
      `${process.env.FRONTEND_URL_RESEND_RESET_PASSWORD}/auth/reset-password?token=${token}`;

    const mailOption = {
      from: `"Avega Bros HRMS(to replace with avega logo)" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject: 'Reset Your Avega Bros HRMS Password',
      html: `
          <h2>Password Reset Request</h2>

          <h3>Hello ${username},</h3>

          <p>We received a request to reset the password for your Avega Bros HRMS account.</p>

          <p>Click the button below to create a new password:</p>

          <a
            href="${resetUrl}"
            style="
              background:#dc2626;
              color:#ffffff;
              padding:12px 24px;
              text-decoration:none;
              border-radius:6px;
              display:inline-block;
              margin:20px 0;
            "
          >
            Reset Password
          </a>

          <p>
            If the button above does not work, copy and paste the following link into your browser:
          </p>

          <p>${resetUrl}</p>

          <p>
            This link will expire in 10 minutes.
          </p>

          <p>
            If you did not request a password reset, you may safely ignore this email.
          </p>
      `,
    };

    return await this.transporter.sendMail(mailOption);
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Avega Bros HRMS(to replace with avega logo)" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 20px;">

                <table width="600" cellpadding="0" cellspacing="0"
                  style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:#c1121f;padding:20px;">
                      <img
                        src="https://minio-api.abas.ph/company-logo/av.png"
                        alt="ABAS"
                        style="
                          max-height:60px;
                          display:block;
                        "
                      />
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">

                      <h2 style="margin-top:0;color:#333;">
                        Password Reset Verification
                      </h2>

                      <p style="color:#555;line-height:1.6;">
                        We received a request to reset the password associated with this account.
                      </p>

                      <p style="color:#555;line-height:1.6;">
                        Please use the verification code below to continue:
                      </p>

                      <div style="text-align:center;margin:30px 0;">
                        <span style="
                          display:inline-block;
                          background:#fff5f5;
                          border:1px solid #fecaca;
                          color:#dc2626;
                          padding:15px 30px;
                          font-size:32px;
                          font-weight:bold;
                          letter-spacing:8px;
                          border-radius:8px;
                        ">
                          ${otp}
                        </span>
                      </div>

                      <p style="color:#555;">
                        This code will expire in
                        <strong>10 minutes</strong>.
                      </p>

                      <p style="color:#555;">
                        If you did not request a password reset, you may safely ignore this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="
                      background:#f8f9fa;
                      padding:20px;
                      text-align:center;
                      color:#6c757d;
                      font-size:12px;
                    ">
                      © ${new Date().getFullYear()} Avega Bros Integrated Shipping Corp.<br />
                      This is an automated message. Please do not reply to this email.
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </div>
      `
    });
  }
}
