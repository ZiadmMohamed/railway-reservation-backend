import { forwardRef, Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketsRepository } from './repository/tickets.repository';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  providers: [TicketsService,TicketsRepository],
  imports: [forwardRef(() => PaymentModule)],
  controllers: [TicketsController],
exports: [TicketsService, TicketsRepository]
 })
export class TicketsModule {}
