import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
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

  async findUnassignedTickets(tripId: string) {
    return this.db
      .select()
      .from(tickets)
      .where(and(eq(tickets.tripId, tripId), eq(tickets.passengerId, null)));
  }

  async assignPassengersToTickets(ticketsToAssign: any[], passengers: string[]) {
    const updates = ticketsToAssign.map((ticket, index) =>
      this.db
        .update(tickets)
        .set({ passengerId: passengers[index] })
        .where(eq(tickets.id, ticket.id))
        .returning(),
    );

    return Promise.all(updates);
  }
}
