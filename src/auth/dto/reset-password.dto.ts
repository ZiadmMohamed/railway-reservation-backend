import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ResetPasswordDto {
  @IsEmail({}, { message: i18nValidationMessage('validation.isEmail') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @Length(6, 6, { message: i18nValidationMessage('validation.length', { min: 6 }) })
  @ApiProperty({ example: '123456' })
  otp: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(6, { message: i18nValidationMessage('validation.minLength', { min: 6 }) })
  @ApiProperty({ example: 'newPassword123' })
  password: string;
}
