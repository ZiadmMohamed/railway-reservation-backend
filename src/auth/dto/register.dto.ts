import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

// register dto
export class RegisterDto {
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @IsEmail({}, { message: i18nValidationMessage('validation.isEmail') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(6, { message: i18nValidationMessage('validation.minLength', { min: 6 }) })
  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  password: string;
}
