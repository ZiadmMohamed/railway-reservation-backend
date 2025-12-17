import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  smtpHost: process.env.SMTP_HOST,
  smtpPort: +process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  emailFrom: process.env.EMAIL_FROM || 'noreply@example.com',
  emailFromName: process.env.EMAIL_FROM_NAME || 'Railway Reservation',
}));
