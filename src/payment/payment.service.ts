import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { Request } from 'express';
import { InjectDb } from 'src/database/db.provider';
import { DB } from 'src/database/drizzle';
import { user } from 'src/database/schemas';
import { eq } from 'drizzle-orm';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(@InjectDb() private readonly db: DB) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async checkoutsession({
    customer_email,
    mode = 'payment',
    cancel_url = process.env.cancel_url,
    success_url = process.env.success_url,
    metadata = {},
    line_items,
    discounts = [],
    payment_method_types,
  }: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const session = await this.stripe.checkout.sessions.create({
      customer_email,
      mode,
      cancel_url,
      success_url,
      metadata,
      line_items,
      discounts,
      payment_method_types,
    });

    return session;
  }

  async createcoupon(params: Stripe.CouponCreateParams): Promise<Stripe.Response<Stripe.Coupon>> {
    const coupon = await this.stripe.coupons.create(params);
    return coupon;
  }
  async createStripeCustomer(email: string, name: string) {
    const customer = await this.stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    // هذا هو الـ ID الذي ستبحثين عنه (يبدأ بـ cus_...)
    return customer.id;
  }
  //   this method to add unsestive data of card to db
  async addCard(userId: string) {
    // 1. جلب بيانات المستخدم
    const userRecord = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });

    if (!userRecord) throw new NotFoundException('User not found');

    let stripeId = userRecord.stripeCustomerId;

    // 2. إذا لم يكن لديه Stripe ID، ننشئه ونحدث القاعدة
    if (!stripeId) {
      stripeId = await this.createStripeCustomer(userRecord.email, userRecord.name);

      await this.db
        .update(user) // تأكد أن 'user' هنا هو مرجع الجدول المستورد من الـ schema
        .set({ stripeCustomerId: stripeId } as any)
        .where(eq(user.id, userId));
    }

    // 3. إنشاء جلسة الـ Setup
    // خطأك السابق: كنت تستخدم User.stripeCustomerId قبل تحديثه، الآن نستخدم stripeId المضمون
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      customer: stripeId, // 👈 الربط بالعميل الصحيح
      success_url: `${process.env.FRONTEND_URL}/booking-summary?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/booking-summary?error=true`,
      metadata: { userId },
    });

    return { url: session.url };
  }

  async webhook(req: Request) {
    const sig = req.headers['stripe-signature'];
    const body = req.body; // Raw Buffer (not parsed JSON)

    if (!sig) {
      throw new BadRequestException('Missing Stripe signature header');
    }
    const endpointsecret = process.env.stripe_webhook_signin_secret as string;

    const event = this.stripe.webhooks.constructEvent(body, sig, endpointsecret);
    if (!event) {
      throw new NotFoundException('event is not exist');
    }

    // Handle Stripe event (e.g., payment success)
    if (event.type != 'checkout.session.completed') {
      // check if the payment failed
      // await   this.orderRepo.updateOne({_id:event.data.object["metadata"].orderId,status:OrderStatus.pending},{status:OrderStatus.canceled,rejectedReason:"fail to pay"})

      throw new BadRequestException('fail to pay');
    }
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode === 'setup') {
      // 1. جلب الـ SetupIntent لمعرفة الـ PaymentMethod المنشأ
      const setupIntent = await this.stripe.setupIntents.retrieve(session.setup_intent as string);
      const paymentMethodId = setupIntent.payment_method as string;

      // 2. استخدام دالتنا لجلب البيانات الآمنة (brand, last4, exp)
      const cardInfo = await this.getSafeCardDetails(paymentMethodId);

      //  save in db
      // await this.db.insert(userCards).values({
      //   userId: session.metadata.userId,
      //   stripePaymentMethodId: paymentMethodId,
      //   ...cardInfo
      // });
      console.log(paymentMethodId);

      console.log(cardInfo);
      //   check the booking
      //   const order=await this.orderRepo.findOne({_id:event.data.object["metadata"]?.orderId})
      //   if(!order){
      //     throw new NotFoundException("order id is not avaialbe")
      //   }
      // change status of booking
      //   await this.confirmPaymenIntent(order.intentId)
      // await   this.orderRepo.updateOne({_id:event.data.object.metadata?.orderId,status:OrderStatus.pending},{status:OrderStatus.placed,paidAt:Date.now()})

      return 'done';
    }
  }

  async getSafeCardDetails(paymentMethodId: string) {
    let paymentMethod;

    try {
      paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
    } catch (error) {
      throw new NotFoundException('Could not retrieve payment method details from Stripe.');
    }

    if (paymentMethod.type !== 'card' || !paymentMethod.card) {
      throw new BadRequestException('The provided payment method is not a card.');
    }

    return {
      stripePaymentMethodId: paymentMethod.id,
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,
      funding: paymentMethod.card.funding,
    };
  }
  async createPaymentIntent(amount: number, currency: string = 'egp') {
    const paymentMethod = await this.paymentMethod();
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency: 'egp',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      payment_method: paymentMethod.id,
    });
    return paymentIntent;
  }
  async paymentMethod(token: string = 'tok_visa') {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: { token },
    });
    return paymentMethod;
  }

  async retrivePaymentIntent(id: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
    return paymentIntent;
  }

  async confirmPaymenIntent(id: string) {
    const intent = await this.retrivePaymentIntent(id);
    if (!intent) {
      throw new BadRequestException('intent is not exist');
    }
    const paymentintentconfirm = await this.stripe.paymentIntents.confirm(intent.id, {
      payment_method: 'pm_card_visa',
    });
    if (paymentintentconfirm.status != 'succeeded') {
      throw new BadRequestException('fail to confirm intent id');
    }
  }

  async refund(id: string) {
    const refund = await this.stripe.refunds.create({ payment_intent: id });
    return refund;
  }
}
