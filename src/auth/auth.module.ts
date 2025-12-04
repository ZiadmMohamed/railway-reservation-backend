import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './auth';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      inject: ['DATABASE', ConfigService],
      useFactory: (db: any, configService: ConfigService) => {
        return {
          auth: createAuth(db, configService),
        };
      },
    }),
  ],
})
export class AuthModule {}
