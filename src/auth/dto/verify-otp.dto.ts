import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifyOtpDto {
  @IsEmail({}, { message: i18nValidationMessage('validation.isEmail') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @Length(6, 6, { message: i18nValidationMessage('validation.length', { min: 6 }) })
  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  otp: string;
}
