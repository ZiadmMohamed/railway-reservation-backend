import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { TrainsRepository } from 'src/trains/repositories/trains.repository';
import { TripsRepo } from './repository/trips.repo';
import { stationRepo } from 'src/stations/repository/station.repo';

@Module({
  
  providers: [TripsService,TrainsRepository,TripsRepo,stationRepo],
  exports: [],
  controllers: [TripsController],
})
export class TripsModule {}
