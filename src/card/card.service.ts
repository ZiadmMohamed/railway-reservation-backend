import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class CardService {
    constructor(private readonly paymentService: PaymentService) {}

    async addCard(userId: string) { 
        return await this.paymentService.addCard(userId);
    }



   async  webhook(sig: string, payload: any){
        
return this.paymentService.webhook(sig, payload);   
 }
}
