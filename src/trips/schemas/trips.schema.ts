import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { trains } from '../../trains/schemas/train.schema';
import { stations } from '../../stations/schemas/stations.schema';
import { tripStops } from '../../trip-stops/schemas/trip-stops.schema';
import { tickets } from '../../tickets/schemas/tickets.schema';

export const trips = pgTable('trips', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  trainId: uuid('train_id')
    .notNull()
    .references(() => trains.id, { onDelete: 'cascade' }),
  destinationFrom: uuid('destination_from')
    .notNull()
    .references(() => stations.id),
  destinationTo: uuid('destination_to')
    .notNull()
    .references(() => stations.id),
  departureDate: timestamp('departure_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const tripsRelations = relations(trips, ({ one, many }) => ({
  train: one(trains, {
    fields: [trips.trainId],
    references: [trains.id],
  }),
  fromStation: one(stations, {
    fields: [trips.destinationFrom],
    references: [stations.id],
    relationName: 'fromStation',
  }),
  toStation: one(stations, {
    fields: [trips.destinationTo],
    references: [stations.id],
    relationName: 'toStation',
  }),
  tripStops: many(tripStops),
  tickets: many(tickets),
}));
