import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { createAuthClient } from 'better-auth/client';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDTO } from './DTO/login.DTO';
import { I18nContext } from 'nestjs-i18n';

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
    await this.authClient.emailOtp.sendVerificationOtp({
      email: registerDto.email, // required
      type: 'sign-in', // required
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

  async login(body: LoginDTO) {
    const result = await this.authClient.signIn.email({
      email: body.email,
      password: body.password,
      rememberMe: true,
    });
    const user = result.data?.user;

    if (!user || !user.id) {
      throw new NotFoundException(I18nContext.current().t('auth.notFound'));
    }

    return { user, token: result.data?.token };
  }
}
