import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { PassengerRepository } from 'src/passenger/repositories/passenger.repository';
import { TicketsRepository } from './repository/tickets.repository';
import { TripsRepo } from 'src/trips/repository/trips.repo';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, PassengerRepository, TicketsRepository, TripsRepo],
  exports: [],
})
export class TicketsModule {}
