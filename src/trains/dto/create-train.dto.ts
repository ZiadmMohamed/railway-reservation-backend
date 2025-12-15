import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class TrainTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  locale: string;

  @ApiProperty({ example: 'Express Train' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  name: string;

  @ApiProperty({ example: 'New York' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  source: string;

  @ApiProperty({ example: 'Boston' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  destination: string;
}

export class CreateTrainDto {
  // @ApiProperty({ example: 'Express Train' })
  // @IsString({ message: i18nValidationMessage('validation.isString') })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  // name: string;

  // @ApiProperty({ example: 'New York' })
  // @IsString({ message: i18nValidationMessage('validation.isString') })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  // source: string;

  // @ApiProperty({ example: 'Boston' })
  // @IsString({ message: i18nValidationMessage('validation.isString') })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  // destination: string;

  @ApiProperty({ example: 'T12345' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  trainNumber: string;

  // @ApiProperty({ example: '100' })
  // @IsNumberString({}, { message: i18nValidationMessage('validation.isNumber') })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  // totalSeats: string;
}
