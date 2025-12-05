import { Injectable, Inject } from '@nestjs/common';
import { AUTH_PROVIDER } from './auth.module';
import { Auth } from 'better-auth';
import { createAuthClient } from 'better-auth/client';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private authClient: ReturnType<typeof createAuthClient>;

    constructor(
        @Inject(AUTH_PROVIDER)
        private readonly auth: Auth<any>,
        private readonly configService: ConfigService,
    ) {
        // Create server-side auth client
        const baseURL = this.configService.get<string>('auth.url') || 'http://localhost:3000';
        this.authClient = createAuthClient({
            baseURL,
            fetchOptions: {
                credentials: 'include',
            },
        });
    }

    async register(registerDto: RegisterDto) {
        // Use better-auth's signup endpoint
        // This will automatically trigger OTP email sending via the emailOTP plugin
        const result = await this.authClient.signUp.email({
            email: registerDto.email,
            password: registerDto.password,
            name: registerDto.name,
        });

        return result;
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        // Use better-auth's verifyEmail endpoint
        const result = await this.authClient.verifyEmail({
            email: verifyOtpDto.email,
            otp: verifyOtpDto.otp,
        });

        return result;
    }
}
