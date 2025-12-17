import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  // TODO: Add enum for type: 'email-verification' or 'password-reset'
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'email-verification' })
  type: string;
}
