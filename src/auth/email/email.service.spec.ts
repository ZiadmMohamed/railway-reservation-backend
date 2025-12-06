import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;
  let mockTransporter: any;
  let mockSendMail: jest.Mock;

  const createMockConfigService = (config: Record<string, any>) => {
    return {
      get: jest.fn((key: string) => config[key] || null),
    } as unknown as ConfigService;
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock transporter
    mockSendMail = jest.fn();
    mockTransporter = {
      sendMail: mockSendMail,
    };

    // Mock nodemailer.createTransport
    (nodemailer.createTransport as jest.Mock) = jest.fn(() => mockTransporter);
  });

  describe('Service Initialization', () => {
    it('should be defined', async () => {
      const mockConfig = createMockConfigService({
        'email.smtpHost': null,
        'email.smtpUser': null,
        'email.smtpPassword': null,
      });
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: mockConfig,
          },
        ],
      }).compile();

      service = module.get<EmailService>(EmailService);
      expect(service).toBeDefined();
    });

    it('should create transporter when SMTP config is provided', async () => {
      const mockConfig = createMockConfigService({
        'email.smtpHost': 'smtp.gmail.com',
        'email.smtpPort': 587,
        'email.smtpUser': 'test@gmail.com',
        'email.smtpPassword': 'password123',
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: mockConfig,
          },
        ],
      }).compile();

      service = module.get<EmailService>(EmailService);

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@gmail.com',
          pass: 'password123',
        },
      });
    });

    it('should not create transporter when SMTP config is missing', async () => {
      const mockConfig = createMockConfigService({
        'email.smtpHost': null,
        'email.smtpUser': null,
        'email.smtpPassword': null,
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: mockConfig,
          },
        ],
      }).compile();

      service = module.get<EmailService>(EmailService);

      expect(nodemailer.createTransport).not.toHaveBeenCalled();
    });

    it('should not create transporter when only some SMTP config is provided', async () => {
      const mockConfig = createMockConfigService({
        'email.smtpHost': 'smtp.gmail.com',
        'email.smtpUser': null, // Missing user
        'email.smtpPassword': 'password123',
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: mockConfig,
          },
        ],
      }).compile();

      service = module.get<EmailService>(EmailService);

      expect(nodemailer.createTransport).not.toHaveBeenCalled();
    });
  });

  describe('sendOTPEmail', () => {
    beforeEach(async () => {
      const mockConfig = createMockConfigService({
        'email.smtpHost': 'smtp.gmail.com',
        'email.smtpPort': 587,
        'email.smtpUser': 'test@gmail.com',
        'email.smtpPassword': 'password123',
        'email.emailFrom': 'noreply@example.com',
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: mockConfig,
          },
        ],
      }).compile();

      service = module.get<EmailService>(EmailService);
      configService = module.get<ConfigService>(ConfigService);
    });

    it('should send OTP email successfully', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.sendOTPEmail('user@example.com', '123456', 'signup');

      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'noreply@example.com',
        to: 'user@example.com',
        subject: 'Your OTP Code',
        text: 'Your OTP code is: 123456. It expires in 5 minutes.',
        html: expect.stringContaining('123456'),
      });

      expect(consoleSpy).toHaveBeenCalledWith('OTP email sent successfully to user@example.com');

      consoleSpy.mockRestore();
    });

    it('should include correct OTP and type in email content', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      await service.sendOTPEmail('user@example.com', '789012', 'verification');

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('789012');
      expect(callArgs.html).toContain('verification');
      expect(callArgs.text).toContain('789012');
    });

    it('should use default emailFrom when not configured', async () => {
      const mockConfigWithoutFrom = createMockConfigService({
        'email.smtpHost': 'smtp.gmail.com',
        'email.smtpPort': 587,
        'email.smtpUser': 'test@gmail.com',
        'email.smtpPassword': 'password123',
        'email.emailFrom': null, // Not configured
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: mockConfigWithoutFrom,
          },
        ],
      }).compile();

      const serviceWithoutFrom = module.get<EmailService>(EmailService);
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      await serviceWithoutFrom.sendOTPEmail('user@example.com', '123456', 'signup');

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@example.com', // Default value
        }),
      );
    });

    it('should throw error when email sending fails', async () => {
      const error = new Error('SMTP connection failed');
      mockSendMail.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(service.sendOTPEmail('user@example.com', '123456', 'signup')).rejects.toThrow(
        'SMTP connection failed',
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to send OTP email to user@example.com:',
        error,
      );

      consoleErrorSpy.mockRestore();
    });

    it('should log to console when transporter is not configured', async () => {
      const mockConfigNoSmtp = createMockConfigService({
        'email.smtpHost': null,
        'email.smtpUser': null,
        'email.smtpPassword': null,
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: mockConfigNoSmtp,
          },
        ],
      }).compile();

      const serviceNoSmtp = module.get<EmailService>(EmailService);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await serviceNoSmtp.sendOTPEmail('user@example.com', '123456', 'signup');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[OTP signup] Email: user@example.com, OTP: 123456 (Email service not configured)',
      );
      expect(mockSendMail).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle different OTP types correctly', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const types = ['signup', 'verification', 'password-reset'];
      for (const type of types) {
        await service.sendOTPEmail('user@example.com', '123456', type);
        const callArgs = mockSendMail.mock.calls[mockSendMail.mock.calls.length - 1][0];
        expect(callArgs.html).toContain(type);
      }

      expect(mockSendMail).toHaveBeenCalledTimes(types.length);
    });
  });
});
