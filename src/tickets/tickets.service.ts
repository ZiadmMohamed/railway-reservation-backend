import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookTicketsDto } from '../tickets/dto/create-booking,dto';
import { PassengerRepository } from 'src/passenger/repositories/passenger.repository';
import { TripsRepo } from 'src/trips/repository/trips.repo';
import { TicketsRepository } from './repository/tickets.repository';

@Injectable()
export class TicketsService {
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly ticketsRepository: TicketsRepository,
    private readonly tripsRepo: TripsRepo,
  ) {}

  async bookTickets(dto: BookTicketsDto, userId: string) {
    for (const passengerId of dto.passengers) {
      const passenger = await this.passengerRepository.findOne(passengerId, userId);
      if (!passenger) {
        throw new NotFoundException('Passenger not found');
      }
    }

    // 2️⃣ Check if trip exists
    const trip = await this.tripsRepo.findOne(dto.tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Get unassigned tickets for this trip
    const unassignedTickets = await this.ticketsRepository.findUnassignedTickets(dto.tripId);

    if (unassignedTickets.length < dto.passengers.length) {
      throw new BadRequestException('Not enough available tickets');
    }

    // Assign passengers to unassigned tickets
    const updatedTickets = await this.ticketsRepository.assignPassengersToTickets(
      unassignedTickets.slice(0, dto.passengers.length),
      dto.passengers,
    );

    return updatedTickets;
  }
}
