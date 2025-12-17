import { Module } from '@nestjs/common';
import { TripsRepository } from './repositories/trips.repository';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  controllers: [TripsController],
  providers: [TripsService, TripsRepository],
})
export class TripsModule {}
