import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [CardController],
  providers: [CardService,PaymentService],
})
export class CardModule {}
