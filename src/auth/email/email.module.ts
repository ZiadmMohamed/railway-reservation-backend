import { Module } from '@nestjs/common';
import { NodeMailerService } from './email.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [NodeMailerService],
  exports:[NodeMailerService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('email.smtpHost'),
            port: parseInt(configService.get<string>('email.smtpPort'), 10),
            secure: configService.get<boolean>('SMTP_SECURE') === true,
            auth: {
              user: configService.get<string>('email.smtpUser'),
              pass: configService.get<string>('email.smtpPassword'),
            },
          },
        };
      },
    }),
  
  ],
})
export class NodeMailerModule {}
