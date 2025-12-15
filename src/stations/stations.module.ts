import { Module } from '@nestjs/common';
import { StationController } from './stations.controller';
import { StationService } from './stations.service';
import { stationRepo } from './repository/station.repo';

@Module({
  controllers:[StationController],
  providers: [StationService,stationRepo],

  exports: [],
})
export class StationsModule {}
