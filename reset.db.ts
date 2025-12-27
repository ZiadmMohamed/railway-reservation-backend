// reset-db.ts
// run this command to delete all db npx ts-node reset-db.ts
import { pgTable, text } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function reset() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL, // تأكد أن هذا الاسم صحيح في الـ .env
  });

  await client.connect();
  console.log('⏳ Cleaning database...');

  try {
    // هذا الأمر سيمسح كل شيء (الجداول والـ Enums) بضربة واحدة
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;');
    console.log('✅ Database is clean now!');
  } catch (err) {
    console.error('❌ Error during reset:', err);
  } finally {
    await client.end();
  }
}

reset();