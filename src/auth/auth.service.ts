import { Injectable, NotFoundException } from '@nestjs/common';
import { createAuthClient } from 'better-auth/client';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from './DTO/login.DTO';
import { TokenService } from 'src/common/service/token/token.service';

@Injectable()
export class AuthService {
  private authClient: ReturnType<typeof createAuthClient>;

  constructor(private readonly configService: ConfigService,
    private readonly TokenService:TokenService
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

  async login(body:LoginDTO){

   const result= await this. authClient.signIn.email({
    email:body.email,
    password: body.password,
    rememberMe: true,
});
const user= result.data?.user
if(!user || !user.id) {
  throw new NotFoundException("user is not found or not confirmed")
}
 
    const access_token= this.TokenService.sign({payload:user.id},{secret:process.env.jwt_secret,expiresIn:"3h"})
    const refresh_token= this.TokenService.sign({payload:user.id},{secret:process.env.jwt_secret,expiresIn:"1d"})
return {access_token,refresh_token,user}
  }
}
