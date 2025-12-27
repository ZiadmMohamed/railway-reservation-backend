import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockStripeInstance = {
  checkout: {
    sessions: {
      create: jest.fn(),
    },
  },
  coupons: {
    create: jest.fn(),
  },
  webhooks: {
    constructEvent: jest.fn(),
  },
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
    confirm: jest.fn(),
  },
  paymentMethods: {
    create: jest.fn(),
    retrieve: jest.fn(),
  },
  refunds: {
    create: jest.fn(),
  },
};

jest.mock('stripe', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockStripeInstance),
  };
});

describe('PaymentService', () => {
  let service: PaymentService;
  let stripeMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    stripeMock = (service as any).stripe;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSafeCardDetails', () => {
    it('should return safe card info when given a valid paymentMethodId', async () => {
      const mockPmResponse = {
        id: 'pm_123',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2030,
          funding: 'credit',
        },
      };

      stripeMock.paymentMethods.retrieve.mockResolvedValue(mockPmResponse);

      const result = await service.getSafeCardDetails('pm_123');

      expect(result).toEqual({
        stripePaymentMethodId: 'pm_123',
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2030,
        funding: 'credit',
      });
      expect(stripeMock.paymentMethods.retrieve).toHaveBeenCalledWith('pm_123');
    });

    it('should throw BadRequestException if the payment method is not a card', async () => {
      stripeMock.paymentMethods.retrieve.mockResolvedValue({ type: 'ideal' });

      await expect(service.getSafeCardDetails('pm_123')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if Stripe fails to find the method', async () => {
      stripeMock.paymentMethods.retrieve.mockRejectedValue(new Error('Not found'));

      await expect(service.getSafeCardDetails('pm_invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkoutsession', () => {
    it('should create a stripe checkout session successfully', async () => {
      const mockSession = { id: 'cs_123', url: 'https://stripe.com/pay' };
      stripeMock.checkout.sessions.create.mockResolvedValue(mockSession);

      const result = await service.checkoutsession({
        customer_email: 'test@example.com',
        line_items: [],
      } as any);

      expect(result).toEqual(mockSession);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalled();
    });
  });

  // ✅ اختبار الـ Webhook
  describe('webhook', () => {
    it('should throw BadRequestException if signature is missing', async () => {
      const mockReq: any = { headers: {}, body: {} };
      await expect(service.webhook(mockReq)).rejects.toThrow(BadRequestException);
    });

    it('should return "done" for a successful checkout.session.completed event', async () => {
      const mockReq: any = {
        headers: { 'stripe-signature': 'valid_sig' },
        body: Buffer.from('{}'),
      };
      const mockEvent = {
        type: 'checkout.session.completed',
        data: { object: { metadata: { orderId: '123' } } },
      };

      stripeMock.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = await service.webhook(mockReq);
      expect(result).toBe('done');
    });
  });

  describe('retrivePaymentIntent', () => {
    it('should retrieve payment intent details', async () => {
      const mockIntent = { id: 'pi_123', amount: 1000 };
      stripeMock.paymentIntents.retrieve.mockResolvedValue(mockIntent);

      const result = await service.retrivePaymentIntent('pi_123');
      expect(result).toEqual(mockIntent);
    });
  });
});
