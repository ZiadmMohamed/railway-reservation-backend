import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { Roles, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { BookTicketsDto } from './dto/create-booking,dto';

@ApiTags('Tickets')
@Controller('Tickets')
export class TicketsController {
  constructor(private readonly TicketsService: TicketsService) {}

  @Post('createTickets')
  @Roles(['admin'])
  async createTicketsAdmin(
    @Body() bookTicketsDto: BookTicketsDto,
    @Session() session: UserSession,
  ) {
    return this.TicketsService.bookTickets(bookTicketsDto, session.user.id);
  }

  @Post('book')
  @Roles(['admin', 'user'])
  async createTickets(@Body() bookTicketsDto: BookTicketsDto, @Session() session: UserSession) {
    return this.TicketsService.bookTickets(bookTicketsDto, session.user.id);
  }
}
