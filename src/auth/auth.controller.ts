import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AllowAnonymous } from './decorators/public.decorator';
import { LoginDTO } from './DTO/login.DTO';
import { I18n, I18nContext, i18nValidationErrorFactory } from 'nestjs-i18n';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. OTP sent to email.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or user already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @AllowAnonymous()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully. Email verified.',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @AllowAnonymous()
  @Post('login')
  @ApiOperation({ summary: 'login  user' })
  @ApiResponse({
    status: 201,
    description: 'User login successfully.',
  })
  @ApiResponse({ status: 400, description: 'user is not found plz sign up' })
  async login(@Body() body: LoginDTO, @I18n() i18n: I18nContext) {
    const user = await this.authService.login(body);
    return { success: true, data: user, message: i18n.t('auth.login') };
  }
}
