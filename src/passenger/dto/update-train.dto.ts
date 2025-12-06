import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateTrainDto {
  @ApiProperty({ example: 'Express Train', required: false })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  source?: string;

  @ApiProperty({ example: 'Boston', required: false })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  destination?: string;

  @ApiProperty({ example: 'T12345', required: false })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  number?: string;

  @ApiProperty({ example: '100', required: false })
  @IsNumberString({}, { message: i18nValidationMessage('validation.isNumber') })
  @IsOptional()
  totalSeats?: string;
}
