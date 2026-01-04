import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PassengerBookingInfo {
  @ApiProperty({ example: 'P12345', description: 'Passenger ID' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  passengerId: string;
}

export class BookTicketsDto {
  @ApiProperty({ example: 'T12345', description: 'Trip ID' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  tripId: string;

  @ArrayNotEmpty({ message: i18nValidationMessage('validation.required') })
  @IsUUID('4', { each: true })
  passengers: string[];
}
