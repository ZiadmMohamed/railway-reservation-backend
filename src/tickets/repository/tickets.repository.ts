import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { tickets } from 'src/tickets/schemas/tickets.schema';
import { DB } from 'src/database/drizzle';
import { InjectDb } from 'src/database/db.provider';
import { seats } from 'src/database/schemas';

@Injectable()
export class TicketsRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async findMany(condition?: any) {
    const query = this.db.select().from(seats);

    if (condition) {
      query.where(condition);
    }

    return query;
  }

  async findAvailableSeats(tripId: string, trainId: string) {
    // get booked seat ids for the trip
    const bookedSeatRows = await this.db
      .select({ seatId: tickets.seatId })
      .from(tickets)
      .where(eq(tickets.tripId, tripId));

    const bookedIdsArray = bookedSeatRows.map(b => b.seatId).filter(Boolean);

    // fetch all seats for the train
    const allSeats = await this.db.select().from(seats).where(eq(seats.trainId, trainId));

    // sort in JS: first by coachNumber, then by seatNumber
    allSeats.sort((a, b) => {
      const ac = a.coachNumber,
        bc = b.coachNumber;
      const coachCompare =
        typeof ac === 'number' && typeof bc === 'number'
          ? ac - bc
          : String(ac).localeCompare(String(bc));
      if (coachCompare !== 0) return coachCompare;

      const asn = a.seatNumber,
        bsn = b.seatNumber;
      return typeof asn === 'number' && typeof bsn === 'number'
        ? asn - bsn
        : String(asn).localeCompare(String(bsn));
    });

    // filter out booked seats in JS
    if (bookedIdsArray.length === 0) return allSeats;
    return allSeats.filter(s => !bookedIdsArray.includes(s.id));
  }

  async insertMany(ticketsToInsert: any[]) {
    return this.db.insert(tickets).values(ticketsToInsert).returning();
  }
}
