import { pgTable, uuid, numeric, pgEnum, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { passengers } from '../../passenger/schemas/passenger.schema';
import { seats } from '../../seats/schemas/seats.schema';
import { trips } from '../../trips/schemas/trips.schema';

export const ticketStatusEnum = pgEnum('ticket_status', ['Booked', 'Cancelled', 'Pending']);

export const tickets = pgTable(
  'tickets',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    passengerId: uuid('passenger_id')
      .notNull()
      .references(() => passengers.id, { onDelete: 'cascade' }),
    seatId: uuid('seat_id')
      .notNull()
      .references(() => seats.id),
    tripId: uuid('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    price: numeric('price').notNull(),
    status: ticketStatusEnum('status').notNull().default('Pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [unique().on(table.tripId, table.seatId)],
);

export const ticketsRelations = relations(tickets, ({ one }) => ({
  passenger: one(passengers, {
    fields: [tickets.passengerId],
    references: [passengers.id],
  }),
  seat: one(seats, {
    fields: [tickets.seatId],
    references: [seats.id],
  }),
  trip: one(trips, {
    fields: [tickets.tripId],
    references: [trips.id],
  }),
}));
