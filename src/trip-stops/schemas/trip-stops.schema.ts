import { pgTable, uuid, timestamp, integer, unique } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { trips } from '../../trips/schemas/trips.schema';
import { stations } from '../../stations/schemas/stations.schema';

export const tripStops = pgTable(
  'trip_stops',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    tripId: uuid('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    stationId: uuid('station_id')
      .notNull()
      .references(() => stations.id),
    arrivalTime: timestamp('arrival_time').notNull(),
    stopOrder: integer('stop_order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [unique().on(table.tripId, table.stopOrder)],
);

export const tripStopsRelations = relations(tripStops, ({ one }) => ({
  trip: one(trips, {
    fields: [tripStops.tripId],
    references: [trips.id],
  }),
  station: one(stations, {
    fields: [tripStops.stationId],
    references: [stations.id],
  }),
}));
