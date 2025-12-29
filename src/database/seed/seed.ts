import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const postgres = require('postgres');
import * as schema from '../schemas';
import { DatabaseSeeder } from './database-seeder';

async function main() {
  console.log('🌱 Railway Database Seeder\n');
  console.log('================================\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    console.error('Please set DATABASE_URL in your .env file');
    process.exit(1);
  }

  console.log('📡 Connecting to database...');

  // Create database connection
  const client = postgres(databaseUrl);
  const db = drizzle(client, { schema });

  console.log('✓ Database connection established\n');

  try {
    // Create and run seeder
    const seeder = new DatabaseSeeder(db);
    await seeder.seedAll();

    console.log('\n================================');
    console.log('✅ Seeding completed successfully!');
    console.log('================================\n');

    // Close connection
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed with error:');
    console.error(error);

    // Close connection
    await client.end();
    process.exit(1);
  }
}

// Run the seeding script
main();
