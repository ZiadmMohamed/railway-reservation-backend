import { PaymentService } from './payment.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockDb: any = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    then: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key';

    service = new PaymentService(mockDb);

    (service as any).stripe = {
      webhooks: { constructEvent: jest.fn() },
      setupIntents: { retrieve: jest.fn() },
      paymentMethods: { retrieve: jest.fn() },
    };
  });

  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('webhook', () => {
    it('should throw BadRequestException if signature is missing', async () => {
      await expect(service.webhook('', {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('addCard', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockDb.then.mockImplementation((cb: any) => Promise.resolve([]).then(cb));

      await expect(service.addCard('invalid_id')).rejects.toThrow(NotFoundException);
    });
  });
});
