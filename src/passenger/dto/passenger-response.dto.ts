import { ApiProperty } from '@nestjs/swagger';
import { Passenger } from '../schemas/passenger.schema';

export class PassengerDto {
  @ApiProperty()
  nationalId: string;

  @ApiProperty()
  passengerName: string;

  constructor(passenger: Passenger) {
    this.nationalId = passenger.nationalId;
    this.passengerName = passenger.passengerName;
  }
}
