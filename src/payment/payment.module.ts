import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TicketsRepository } from 'src/tickets/repository/tickets.repository';

@Module({
  imports:[TicketsRepository],
  exports: [PaymentService],
  providers: [PaymentService],
})
export class PaymentModule {}
