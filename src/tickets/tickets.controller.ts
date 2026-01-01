import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Roles, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { TicketIdDTO } from './dto/paymentcheckout.dto';
@ApiTags("Tickets")
@Controller('tickets')
export class TicketsController {
    constructor( private readonly ticketsService: TicketsService) {}
    @Post(':ticketId')
      @ApiBearerAuth()
      @UseGuards(AuthGuard) // التأكد من تسجيل دخول المستخدم أولاً
      @Roles(['admin', 'user'])
      @ApiOperation({ summary: 'payment checkouut  created successfully' })
      @ApiResponse({
        status: 201,
        description: 'payment checkouut  created successfully',
      })
      async PaymentCkeckout(@Session() session:UserSession, @Param() param:TicketIdDTO) {
        const data = await this.ticketsService.PaymentCkeckout(session.user,param.ticketId);
        return { message: 'trip created successfully', data };
      }
    

}
