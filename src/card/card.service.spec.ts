import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { PaymentService } from '../payment/payment.service';

describe('CardService', () => {
  let service: CardService;
  let paymentService: PaymentService;

  const mockPaymentService = {
    addCard: jest.fn(),
    webhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addCard', () => {
    it('should call paymentService.addCard with correct userId', async () => {
      const userId = 'test-user-123';
      mockPaymentService.addCard.mockResolvedValue({ url: 'http://stripe-url.com' });

      const result = await service.addCard(userId);

      expect(paymentService.addCard).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ url: 'http://stripe-url.com' });
    });
  });

  describe('webhook', () => {
    it('should call paymentService.webhook with correct params', async () => {
      const sig = 'signature';
      const payload = { id: 'evt_123' };
      mockPaymentService.webhook.mockResolvedValue('done');

      const result = await service.webhook(sig, payload);

      expect(paymentService.webhook).toHaveBeenCalledWith(sig, payload);
      expect(result).toBe('done');
    });
  });
});
