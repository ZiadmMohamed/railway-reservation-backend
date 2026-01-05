import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';


export class BookTicketsDto {
  @ApiProperty({ example: 'T12345', description: 'Trip ID' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  tripId: string;

  @ArrayNotEmpty({ message: i18nValidationMessage('validation.required') })
  @IsUUID('4', { each: true })
  passengers: string[];
}
