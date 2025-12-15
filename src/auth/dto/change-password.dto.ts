import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangePasswordDto {
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @ApiProperty({ example: 'oldPassword123' })
  currentPassword: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(6, { message: i18nValidationMessage('validation.minLength', { min: 6 }) })
  @ApiProperty({ example: 'newPassword123' })
  newPassword: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @ApiProperty({ example: 'newPassword123' })
  confirmPassword: string;
}
