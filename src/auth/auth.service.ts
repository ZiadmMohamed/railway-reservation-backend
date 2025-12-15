import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAuthClient } from 'better-auth/client';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private authClient: ReturnType<typeof createAuthClient>;

  constructor(private readonly configService: ConfigService) {
    const baseURL =
      this.configService.get<string>('AUTH_URL') ||
      this.configService.get<string>('auth.url') ||
      'http://localhost:3000';

    this.authClient = createAuthClient({
      baseURL,
      fetchOptions: { credentials: 'include' },
    });
  }

  async register(registerDto: RegisterDto) {

    const result = await this.authClient.signUp.email({
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
    });

    await this.authClient.emailOtp.sendVerificationOtp({
      email: registerDto.email,
      type: 'email-verification',
    });

    return result;
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {

    const result = await this.authClient.emailOtp.checkVerificationOtp({
      email: verifyOtpDto.email,
      type: 'email-verification',
      otp: verifyOtpDto.otp,
    });

    return result;
  }
}
