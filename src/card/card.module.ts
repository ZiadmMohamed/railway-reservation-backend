import { forwardRef, Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { PaymentService } from 'src/payment/payment.service';
import { TicketsModule } from 'src/tickets/tickets.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  controllers: [CardController],
  providers: [CardService, PaymentService],
  imports: [forwardRef(() => PaymentModule), forwardRef(() => TicketsModule)],
})
export class CardModule {}
