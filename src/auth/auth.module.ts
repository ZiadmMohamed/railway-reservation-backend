import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NodeMailerService } from './email/email.service';
import { NodeMailerModule } from './email/email.module';

@Module({
  imports: [
    NodeMailerModule,
    
    ConfigModule,
    BetterAuthModule.forRootAsync({
      inject: ['DATABASE', ConfigService],
      useFactory: (db: any, configService: ConfigService, emailService: NodeMailerService) => {
        return {
          auth: createAuth(db, configService, emailService),
        };
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}