import { eq, and, SQL } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { DB } from '../drizzle';

/**
 * Generic helper function to seed data if it doesn't already exist
 * @param db - The database instance
 * @param table - The Drizzle table schema
 * @param data - Array of data items to seed
 * @param conditionFn - Function that returns the condition object for checking existence
 * @param logPrefix - Optional prefix for log messages
 * @returns Promise<void>
 */
export async function seedDataIfNotExist<TTable extends PgTable, TData extends Record<string, any>>(
  db: DB,
  table: TTable,
  data: TData[],
  conditionFn: (item: TData) => Partial<Record<keyof TTable['$inferSelect'], any>>,
  logPrefix = 'Records',
): Promise<void> {
  let insertedCount = 0;
  let skippedCount = 0;

  for (const item of data) {
    const condition = conditionFn(item);

    // Build WHERE clause from condition
    const whereConditions: SQL[] = [];
    for (const [key, value] of Object.entries(condition)) {
      if (table[key]) {
        whereConditions.push(eq(table[key], value));
      }
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(table)
      .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0])
      .limit(1);

    if (existing.length === 0) {
      // Insert new record
      await db.insert(table).values(item as any);
      insertedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`${logPrefix}: ${insertedCount} inserted, ${skippedCount} skipped (already exist)`);
}
