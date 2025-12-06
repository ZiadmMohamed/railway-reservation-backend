import { Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { PassengerRepository } from './repositories/passenger.repository';

@Module({
  controllers: [PassengerController],
  providers: [PassengerService, PassengerRepository],
  exports: [PassengerService],
})
export class PassengerModule {}
