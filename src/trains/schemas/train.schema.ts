import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { seats } from '../../seats/schemas/seats.schema';
import { trips } from '../../trips/schemas/trips.schema';
import { trainTranslations } from './train-translations.schema';

export const trains = pgTable('trains', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  trainNumber: text('train_number').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const trainsRelations = relations(trains, ({ many }) => ({
  seats: many(seats),
  trips: many(trips),

  translations: many(trainTranslations),

}));
