import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodeMailerService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(email: string, otp: string, type: string): Promise<void> {
    await this.mailerService.sendMail({
      from: '"User Feedback" <noreply@feedback.com>',
      to: email, // list of receivers
      subject: type, // Subject line
      html: `
          <h2>Your OTP Code</h2>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>It expires in 5 minutes.</p>
          <p>Type: ${type}</p>
        `,
    });
  }
}
