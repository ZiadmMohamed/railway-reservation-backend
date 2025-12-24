import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { Request } from 'express';
import { InjectDb } from 'src/database/db.provider';
import { DB } from 'src/database/drizzle';
import { user } from 'src/database/schemas';
import { eq } from 'drizzle-orm';
import { userCards } from 'src/database/schemas';

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

    return customer.id;
  }
  //   this method to add unsestive data of card to db
  async addCard(userId: string) {
    const userRecord = await this.db.select().from(user).where(eq(user.id, userId)).limit(1).then(res => res[0]);
  
console.log("user",userRecord);
    if (!userRecord) throw new NotFoundException('User not found');

    let stripeId = userRecord.stripeCustomerId;

    // 2. إذا لم يكن لديه Stripe ID، ننشئه ونحدث القاعدة
    if (!stripeId) {
      stripeId = await this.createStripeCustomer(userRecord.email, userRecord.name);

      await this.db
        .update(user)
        .set({ stripeCustomerId: stripeId } as any)
        .where(eq(user.id, userId));
    }

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

  async webhook(sig: string, payload: any) {
    // إذا كان الـ payload عبارة عن Object وليس Buffer، حوله لـ String
    let finalPayload = Buffer.isBuffer(payload) 
        ? payload 
        : JSON.stringify(payload);
        if (!(payload instanceof Buffer) && typeof payload === 'object') {
    finalPayload = JSON.stringify(payload);
  }
    if (!sig) {
      throw new BadRequestException('Missing Stripe signature header');
    }
    const endpointsecret = process.env.STRIPE_WEBHOOK_SECRET as string;
console.log("endpointsecret",endpointsecret); 

    const event = this.stripe.webhooks.constructEvent(finalPayload, sig, endpointsecret);
    console.log("event",event);
    if (!event) {
    

      throw new NotFoundException('event is not exist');
    }

    // Handle Stripe event (e.g., payment success)
    if (event.type != 'checkout.session.completed') {
      // check if the payment failed
      // await   this.orderRepo.updateOne({_id:event.data.object["metadata"].orderId,status:OrderStatus.pending},{status:OrderStatus.canceled,rejectedReason:"fail to pay"})

      throw new BadRequestException('fail to pay');}
          //   check the booking
      //   const order=await this.orderRepo.findOne({_id:event.data.object["metadata"]?.orderId})
      //   if(!order){
      //     throw new NotFoundException("order id is not avaialbe")
      //   }
      // change status of booking
      //   await this.confirmPaymenIntent(order.intentId)
      // await   this.orderRepo.updateOne({_id:event.data.object.metadata?.orderId,status:OrderStatus.pending},{status:OrderStatus.placed,paidAt:Date.now()})

    const session = event.data.object as Stripe.Checkout.Session;
      console.log("session",session);
      console.log("sessionintent",session.setup_intent);

    if (session.mode === 'setup' ) {
      const setupIntent = await this.stripe.setupIntents.retrieve(session.setup_intent as string,{ expand: ['payment_method'] });
      console.log("setupIntent",setupIntent);
      const paymentMethodId = setupIntent.payment_method["id"] as string;
      const cardInfo = await this.getSafeCardDetails(paymentMethodId);

      //  save in db
      console.log("Metadata:", session.metadata)
      await this.db.insert(userCards).values({
        userId: session.metadata.userId,
        stripePaymentMethodId: paymentMethodId,
        ...cardInfo
      });
      console.log("paymentMethodId",setupIntent);

      console.log(cardInfo);

      return 'done';
    }
    
          return 'done';

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
