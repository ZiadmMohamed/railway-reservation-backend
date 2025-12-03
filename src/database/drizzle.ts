import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

// Use require for postgres package due to ESM/CommonJS compatibility
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const postgres = require('postgres');

export const createDatabase = (configService: ConfigService) => {
  const databaseUrl = configService.get<string>('database.url');

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = postgres(databaseUrl);
  return drizzle(client, { schema });
};
