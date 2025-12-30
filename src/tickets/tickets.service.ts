import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookTicketsDto } from '../tickets/dto/create-booking,dto';
import { PassengerRepository } from 'src/passenger/repositories/passenger.repository';
import { DB } from 'src/database/drizzle';
import { InjectDb } from 'src/database/db.provider';
import { TripsRepo } from 'src/trips/repository/trips.repo';
import { seats } from 'src/seats/schemas/seats.schema';
import { tickets } from './schemas/tickets.schema';
import { eq, and } from 'drizzle-orm';
import { TicketsRepository } from './repository/tickets.repository';

@Injectable()
export class TicketsService {
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly ticketsRepository: TicketsRepository,
    private readonly tripsRepo: TripsRepo,
  ) {}

  async bookTickets(dto: BookTicketsDto, userId: string) {
    dto.passengers.forEach(async item => {
      // 1️⃣ check passenger exists & belongs to user
      const passenger = await this.passengerRepository.findOne(item.passengerId, userId);
      if (!passenger) {
        throw new NotFoundException('Passenger not found');
      }
    });

    // 2️⃣ Check if trip exists
    const trip = await this.tripsRepo.findOne(dto.tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    console.log('Trip found:', trip);

    // ensure tripId and trainId are the correct variables in this scope
    const availableSeats = await this.ticketsRepository.findAvailableSeats(
      dto.tripId,
      trip.trainId,
    );
    console.log('Available seats:', availableSeats);

    if (availableSeats.length < dto.passengers.length) {
      throw new BadRequestException('Not enough available seats');
    }

    const ticketsToInsert = dto.passengers.map((p, index) => ({
      passengerId: p.passengerId,
      tripId: dto.tripId,
      seatId: availableSeats[index].id,
      price: 50,
    }));
    console.log('Tickets to insert:', ticketsToInsert);

    const tickets = await this.ticketsRepository.insertMany(ticketsToInsert);
    return tickets;
  }
}
