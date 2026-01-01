import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketsRepository } from './repository/tickets.repository';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  providers: [TicketsService, TicketsRepository, PaymentService],
  imports: [PaymentModule],
  controllers: [TicketsController],
})
export class TicketsModule {}
