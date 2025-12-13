import { pgTable, uuid, integer, pgEnum, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { trains } from '../../trains/schemas/train.schema';
import { tickets } from '../../tickets/schemas/tickets.schema';

export const seatClassEnum = pgEnum('seat_class', ['First', 'Economy', 'Business']);

export const seats = pgTable(
  'seats',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    trainId: uuid('train_id')
      .notNull()
      .references(() => trains.id, { onDelete: 'cascade' }),
    coachNumber: integer('coach_number').notNull(),
    seatNumber: integer('seat_number').notNull(),
    class: seatClassEnum('class').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [unique().on(table.trainId, table.coachNumber, table.seatNumber)],
);

export const seatsRelations = relations(seats, ({ one, many }) => ({
  train: one(trains, {
    fields: [seats.trainId],
    references: [trains.id],
  }),
  tickets: many(tickets),
}));
