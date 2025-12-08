import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';
import { ConfigService } from '@nestjs/config';

export const createAuth = (db: any, configService: ConfigService, email?: any) => {
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
      emailOTP({
        otpLength: 6,
        expiresIn: 300, // 5 minutes
        sendVerificationOTP: async ({ email, otp, type }) => {
          if (emailService) {
            await emailService.sendOTPEmail(email, otp, type);
          } else {
            console.log(`[OTP ${type}] Email: ${email}, OTP: ${otp}`);
          }
        },
      }),
    ],
    hooks: {},
  });
};
