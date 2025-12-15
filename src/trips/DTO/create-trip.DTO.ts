import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateTripDTO {
  @IsString()
  @ApiProperty({ example: 'P123456' })
  trainId: string;
  @IsString()
  @ApiProperty({ example: 'P123456' })
  destinationFrom: string;
      @IsString()
      @ApiProperty({ example: 'P123456' })
  destinationTo: string;
      @IsDate()
      @ApiProperty({ example: '9:00' })
      @Type(() => Date)
  departureDate: Date;
}
