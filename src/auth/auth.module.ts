import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './auth';
import { AuthController } from './auth.controller';
import { NodeMailerService } from './email/email.service';
import { NodeMailerModule } from './email/email.module';

@Module({
  imports: [
    NodeMailerModule,
    ConfigModule,
    BetterAuthModule.forRootAsync({
      imports: [NodeMailerModule, ConfigModule],
      inject: ['DATABASE', ConfigService, NodeMailerService],
      useFactory: (db: any, configService: ConfigService, emailService: NodeMailerService) => {
        return {
          auth: createAuth(db, configService, emailService),
        };
      },
    }),
  ],

  controllers: [AuthController],
  providers: [NodeMailerService],
  exports: [],
})
export class AuthModule {}
