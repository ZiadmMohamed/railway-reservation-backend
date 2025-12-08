import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from 'src/common/service/token/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    BetterAuthModule.forRootAsync({
      inject: ['DATABASE', ConfigService],
      useFactory: (db: any, configService: ConfigService) => {
        return {
          auth: createAuth(db, configService),
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
