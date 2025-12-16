import { NodeMailerService } from './email/email.service';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, bearer, emailOTP } from 'better-auth/plugins';
import { ConfigService } from '@nestjs/config';

export const createAuth = (
  db: any,
  configService: ConfigService,
  nodeMailerService: NodeMailerService,
) => {
  console.log('nodeMailerService', nodeMailerService);

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
    plugins: [     admin() ,
      bearer(),
      emailOTP({
        otpLength: 6,
        expiresIn: 300, // 5 minutes
    async    sendVerificationOTP  ({ email, otp, type }){
          console.log(otp,email,type);

          if (type === "sign-in") {
            console.log("ooo",nodeMailerService);
             
            await nodeMailerService.sendMail(email, otp, type);
          }
        },
      }),
    ],
    hooks: {},
  });
};
