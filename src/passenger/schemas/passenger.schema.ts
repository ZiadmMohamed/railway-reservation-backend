import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { user } from '../../auth/schemas/auth.schema';
import { tickets } from '../../tickets/schemas/tickets.schema';

export const passengers = pgTable('passengers', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  nationalId: text('national_id').notNull().unique(),
  passengerName: text('passenger_name').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const passengerRelations = relations(passengers, ({ one, many }) => ({
  user: one(user, {
    fields: [passengers.userId],
    references: [user.id],
  }),
  tickets: many(tickets),
}));

export type Passenger = InferSelectModel<typeof passengers>;
