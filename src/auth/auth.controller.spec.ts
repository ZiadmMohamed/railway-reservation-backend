import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

// Mock better-auth/client to avoid ESM import issues
jest.mock('better-auth/client', () => ({
  createAuthClient: jest.fn(() => ({
    signUp: {
      email: jest.fn(),
    },
    verifyEmail: jest.fn(),
  })),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    verifyOtp: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3000'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should call authService.register with correct parameters', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      };

      mockAuthService.register.mockResolvedValue({ data: { user: {} } });

      await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });
    });

    it('should handle registration errors', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const error = new Error('User already exists');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow('User already exists');
    });
  });
  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with email', async () => {
      const dto = { email: 'user@example.com' };
      const expected = { message: 'OTP sent' };

      mockAuthService.forgotPassword.mockResolvedValue(expected);

      const result = await controller.forgotPassword(dto as any);

      expect(authService.forgotPassword).toHaveBeenCalledWith('user@example.com');
      expect(authService.forgotPassword).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should handle forgotPassword errors', async () => {
      const dto = { email: 'not-registered@example.com' };
      const error = new Error('This email is not registered.');

      mockAuthService.forgotPassword.mockRejectedValue(error);

      await expect(controller.forgotPassword(dto as any)).rejects.toThrow(
        'This email is not registered.',
      );
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword with dto', async () => {
      const dto: ResetPasswordDto = {
        email: 'user@example.com',
        otp: '123456',
        password: 'newPassword123',
      };

      const expected = { message: 'Password reset successfully' };
      mockAuthService.resetPassword.mockResolvedValue(expected);

      const result = await controller.resetPassword(dto);

      expect(authService.resetPassword).toHaveBeenCalledWith(dto);
      expect(authService.resetPassword).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should handle resetPassword errors', async () => {
      const dto: ResetPasswordDto = {
        email: 'user@example.com',
        otp: '000000',
        password: 'newPassword123',
      };

      const error = new Error('Invalid or expired OTP.');
      mockAuthService.resetPassword.mockRejectedValue(error);

      await expect(controller.resetPassword(dto)).rejects.toThrow('Invalid or expired OTP.');
    });
  });
});
