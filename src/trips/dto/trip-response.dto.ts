import { ApiProperty } from '@nestjs/swagger';

export class TripDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  trainId: string;

  @ApiProperty({ example: 'uuid' })
  destinationFrom: string;

  @ApiProperty({ example: 'uuid' })
  destinationTo: string;

  @ApiProperty({ example: '2025-12-18T09:00:00.000Z' })
  departureDate: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(trip: any) {
    this.id = trip.id;
    this.trainId = trip.trainId;
    this.destinationFrom = trip.destinationFrom;
    this.destinationTo = trip.destinationTo;
    this.departureDate = trip.departureDate;
    this.createdAt = trip.createdAt;
    this.updatedAt = trip.updatedAt;
  }

  static fromArray(trips: any[]) {
    return trips.map(trip => new TripDto(trip));
  }
}

export class SingleTripResponseDto {
  @ApiProperty({ example: 'Trip details' })
  message: string;

  @ApiProperty({ type: TripDto, required: false })
  data?: TripDto;
}

export class TripListResponseDto {
  @ApiProperty({ example: 'Trips list' })
  message: string;

  @ApiProperty({ type: [TripDto] })
  data: TripDto[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: 50,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
