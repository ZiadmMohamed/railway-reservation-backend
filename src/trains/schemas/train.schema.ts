import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const train = pgTable('train', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  number: text('number').notNull().unique(),
  source: text('source').notNull(),
  destination: text('destination').notNull(),
  totalSeats: text('total_seats').notNull(),
  availableSeats: text('available_seats').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
