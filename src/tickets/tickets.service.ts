import { Injectable } from '@nestjs/common';
import { TicketsRepository } from './repository/tickets.repository';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class TicketsService {
    constructor( private readonly ticketsRepository: TicketsRepository,
        private readonly paymentservice:PaymentService
    ) {}    
    async PaymentCkeckout(user:any,ticketId:string){
       const ticket = await this.ticketsRepository.findOne(ticketId,user.id);
if(ticket.status === "Pending"){
   const session=    await  this.paymentservice.checkoutsession({customer_email:user.email,metadata:{ticketId:ticket.id  as unknown as string},
        line_items:[{price_data:{currency:'usd',
        product_data:{name:`Ticket for seat ${ticket.seatId}`},
        unit_amount:Number(ticket.price) * 100,
        },
        quantity:1,
    }],payment_method_types:['card']}
       );
       const intent=await this.paymentservice.createPaymentIntent(Number(ticket.price) as number)
await this.ticketsRepository.updateTicket(ticketId,intent.id)

return session


}


    }



}
