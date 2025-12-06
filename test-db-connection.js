// Quick script to test database connection
const postgres = require('postgres');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/railway';

console.log('Testing database connection...');
console.log('URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Hide password

const sql = postgres(databaseUrl);

sql`SELECT version()`
  .then((result) => {
    console.log('✅ Database connection successful!');
    console.log('PostgreSQL version:', result[0].version);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    process.exit(1);
  })
  .finally(() => {
    sql.end();
  });

