import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDTO {
  @IsEmail({}, { message: i18nValidationMessage('validation.isEmail') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @ApiProperty({ example: '*****' })
  password: string;
}
