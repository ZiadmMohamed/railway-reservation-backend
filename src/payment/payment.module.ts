import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [forwardRef(() => TicketsModule)],
  exports: [PaymentService],
  providers: [PaymentService],
})
export class PaymentModule {}
