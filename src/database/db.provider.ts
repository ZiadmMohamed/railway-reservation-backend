import { Inject } from '@nestjs/common';
import { createDatabase } from './drizzle';
import { ConfigService } from '@nestjs/config';

export const DB_PROVIDER = 'DATABASE';

export const InjectDb = () => Inject(DB_PROVIDER);

export const dbProvider = {
  provide: DB_PROVIDER,
  useFactory: (configService: ConfigService) => createDatabase(configService),
  inject: [ConfigService],
};
