import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    BetterAuthModule.forRootAsync({
      imports: [EmailModule],
      inject: ['DATABASE', ConfigService, EmailService],
      useFactory: (db: any, configService: ConfigService, emailService: EmailService) => {
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
