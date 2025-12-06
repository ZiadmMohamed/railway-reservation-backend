import { pgTable, text, unique } from 'drizzle-orm/pg-core';
import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { user } from 'src/database/schemas';

export const passenger = pgTable(
  'passenger',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    nationalId: text('national_id').notNull(),
    passengerName: text('passenger_name').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [unique().on(table.userId, table.nationalId)],
);

export const passengerRelations = relations(passenger, ({ one }) => ({
  user: one(user, {
    fields: [passenger.userId],
    references: [user.id],
  }),
}));

export type Passenger = InferSelectModel<typeof passenger>;
