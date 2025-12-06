import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';

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

            await expect(controller.register(registerDto)).rejects.toThrow(
                'User already exists',
            );
        });
    });
});

