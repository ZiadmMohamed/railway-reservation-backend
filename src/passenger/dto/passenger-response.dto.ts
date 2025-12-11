import { ApiProperty } from '@nestjs/swagger';
import { Passenger } from './passenger.dto';
// added two reponseTypes for swagger documentation
export class SinglePassengerResponseDto {
  @ApiProperty({ example: 'Passenger retrieved successfully' })
  message: string;

  @ApiProperty({ type: Passenger })
  data?: Passenger;
}

export class PassengerListResponseDto {
  @ApiProperty({ example: 'Passengers retrieved successfully' })
  message: string;

  @ApiProperty({ type: [Passenger] })
  data: Passenger[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
