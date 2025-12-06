import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get<string>('email.smtpHost');
    const smtpPort = this.configService.get<number>('email.smtpPort');
    const smtpUser = this.configService.get<string>('email.smtpUser');
    const smtpPassword = this.configService.get<string>('email.smtpPassword');

    if (smtpHost && smtpUser && smtpPassword) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });
    }
  }

  async sendOTPEmail(to: string, otp: string, type: string) {
    if (!this.transporter) {
      console.log(`[OTP ${type}] Email: ${to}, OTP: ${otp} (Email service not configured)`);
      return;
    }

    const from = this.configService.get<string>('email.emailFrom') || 'noreply@example.com';

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
        html: `
          <h2>Your OTP Code</h2>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>It expires in 5 minutes.</p>
          <p>Type: ${type}</p>
        `,
      });
      console.log(`OTP email sent successfully to ${to}`);
    } catch (error) {
      console.error(`Failed to send OTP email to ${to}:`, error);
      throw error;
    }
  }
}
