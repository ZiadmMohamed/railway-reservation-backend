import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDatabase } from './drizzle';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return createDatabase(configService);
      },
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
