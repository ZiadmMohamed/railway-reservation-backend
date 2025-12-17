import { ApiProperty } from '@nestjs/swagger';
import { Passenger as PassengerSchema } from '../schemas/passenger.schema';

export class Passenger {
  @ApiProperty()
  nationalId: string;

  @ApiProperty()
  passengerName: string;

  constructor(passenger: PassengerSchema) {
    this.nationalId = passenger.nationalId;
    this.passengerName = passenger.passengerName;
  }
  static fromArray(passengers: PassengerSchema[]): Passenger[] {
    return passengers.map(p => new Passenger(p));
  }
}
