import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAuthClient } from 'better-auth/client';
import { eq } from 'drizzle-orm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { user } from './schemas/auth.schema';

@Injectable()
export class AuthService {
  [x: string]: any;
  private authClient: ReturnType<typeof createAuthClient>;

  constructor(
    private readonly configService: ConfigService,
    @Inject('DATABASE') private readonly db: any,
  ) {
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
    return this.authClient.emailOtp.checkVerificationOtp({
      email: verifyOtpDto.email,
      type: 'email-verification',
      otp: verifyOtpDto.otp,
    });
  }

  async forgotPassword(email: string) {
    const found = await this.db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (found.length === 0) {
      throw new BadRequestException('This email is not registered.');
    }

    const result = await this.authClient.forgetPassword.emailOtp({ email });

    if ((result as any)?.error) {
      throw new BadRequestException((result as any).error?.message || 'Failed to send OTP.');
    }

    return { message: 'OTP sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const result = await this.authClient.emailOtp.resetPassword({
      email: dto.email,
      otp: dto.otp,
      password: dto.password,
    });

    if ((result as any)?.error) {
      throw new BadRequestException((result as any).error?.message || 'Invalid or expired OTP.');
    }

    return { message: 'Password reset successfully' };
  }

  async changePassword(dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const result = await this.authClient.changePassword({
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
      revokeOtherSessions: false,
    });

    if ((result as any)?.error) {
      const msg = (result as any).error?.message || 'Failed to change password.';

      if (msg.toLowerCase().includes('current') || msg.toLowerCase().includes('password')) {
        throw new BadRequestException('Incorrect current password.');
      }

      throw new BadRequestException(msg);
    }

    return { message: 'Password updated successfully' };
  }
}
