import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// Use require for postgres package due to ESM/CommonJS compatibility
// eslint-disable-next-line @typescript-eslint/no-var-requires
const postgres = require('postgres');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });
