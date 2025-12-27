import { NodeMailerService } from './email/email.service';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, emailOTP, openAPI } from 'better-auth/plugins';
import { ConfigService } from '@nestjs/config';

export const createAuth = (
  db: any,
  configService: ConfigService,
  nodeMailerService: NodeMailerService,
) => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    secret: configService.get<string>('auth.secret')!,
    baseURL: configService.get<string>('auth.url') || 'http://localhost:3000',
    basePath: configService.get<string>('auth.basePath') || '/api/auth',
    plugins: [
      bearer(),
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          await nodeMailerService.sendMail(email, otp, type);
        },
        overrideDefaultEmailVerification: true,
      }),
      openAPI(),
    ],
  });
};
