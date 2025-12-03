import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';
import { ConfigService } from '@nestjs/config';

// Use require for postgres package due to ESM/CommonJS compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const postgres = require('postgres');

/**
 * Create a new database instance
 * @param configService - The config service
 * @returns The database instance
 */
export const createDatabase = (configService: ConfigService) => {
  const databaseUrl = configService.get<string>('database.url');

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = postgres(databaseUrl);
  return drizzle(client, { schema });
};

/**
 * The database type
 * @returns The database type
 */
export type DB = ReturnType<typeof createDatabase>;
