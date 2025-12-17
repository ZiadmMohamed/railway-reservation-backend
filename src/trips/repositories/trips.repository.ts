// src/trips/repositories/trips.repository.ts
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

import { trips } from '../schemas/trips.schema';
import { trains } from '../../trains/schemas/train.schema';
import { stations } from '../../stations/schemas/stations.schema';
import { tripStops } from '../../trip-stops/schemas/trip-stops.schema';
import { tickets } from '../../tickets/schemas/tickets.schema';
import { DB } from 'src/database/drizzle';
import { InjectDb } from 'src/database/db.provider';

// 👇 aliases
const fromStations = alias(stations, 'fromStations');
const toStations = alias(stations, 'toStations');

@Injectable()
export class TripsRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  /**
   * Get a trip by ID with related train & stations
   */
  async findOne(id: string) {
    const [row] = await this.db
      .select({
        trip: trips,
        train: trains,
        fromStation: fromStations,
        toStation: toStations,
      })
      .from(trips)
      .leftJoin(trains, eq(trips.trainId, trains.id))
      .leftJoin(fromStations, eq(trips.destinationFrom, fromStations.id))
      .leftJoin(toStations, eq(trips.destinationTo, toStations.id))
      .where(eq(trips.id, id));

    if (!row) return null;

    return {
      ...row.trip,
      train: row.train,
      fromStation: row.fromStation,
      toStation: row.toStation,
    };
  }

  /**
   * Delete a trip by ID
   */
  async delete(id: string) {
    await this.db.delete(tickets).where(eq(tickets.tripId, id));
    await this.db.delete(tripStops).where(eq(tripStops.tripId, id));
    await this.db.delete(trips).where(eq(trips.id, id));
  }

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return this.db.select().from(trips).limit(limit).offset(offset);
  }

  async count() {
    const result = await this.db.select().from(trips);
    return result.length;
  }
}
