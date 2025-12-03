import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { ConfigService } from '@nestjs/config';

export const createAuth = (db: any, configService: ConfigService) => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
    },
    secret: configService.get<string>('auth.secret')!,
    baseURL: configService.get<string>('auth.url') || 'http://localhost:3000',
    basePath: configService.get<string>('auth.basePath') || '/api/auth',
    hooks: {},
  });
};
