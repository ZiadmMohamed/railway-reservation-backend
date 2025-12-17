import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AllowAnonymous } from './decorators/public.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDTO } from './dto/login.dto';
import { EmailVerificationDto } from './dto/email-verification.dto';

// NOTE:
// This controller is only for Swagger documentation.
// Authentication is fully handled by Better Auth.

@AllowAnonymous()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('sign-up/email')
  async signup(@Body() _registerDto: RegisterDto) {}

  @Post('sign-in/email')
  async signin(@Body() _loginDto: LoginDTO) {}

  @Post('/email-otp/send-verification-otp')
  async sendVerificationOTP(@Body() _emailVerificationDto: EmailVerificationDto) {}

  @Post('/email-otp/verify-email')
  async verifyEmail(@Body() _emailVerificationDto: VerifyOtpDto) {}

  @Post('sign-out')
  async logout() {}
}
