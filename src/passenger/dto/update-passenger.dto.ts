import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdatePassengerDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  passengerName?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  nationalId?: string;
}
