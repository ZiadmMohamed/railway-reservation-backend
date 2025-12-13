import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { tripStops } from '../../trip-stops/schemas/trip-stops.schema';
import { trips } from '../../trips/schemas/trips.schema';

export const stations = pgTable('stations', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  stationEnglishName: text('station_english_name').notNull(),
  stationArabicName: text('station_arabic_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const stationsRelations = relations(stations, ({ many }) => ({
  tripStops: many(tripStops),
  tripsFrom: many(trips, { relationName: 'fromStation' }),
  tripsTo: many(trips, { relationName: 'toStation' }),
}));

