import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';


import { PaginationQueryParams } from '../common/dtos/pagination.query-params.dto';
import { AllowAnonymous, AuthGuard, Roles, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { BookTicketsDto } from './dto/create-booking,dto';

@ApiTags('Tickets')
@Controller('Tickets')
export class TicketsController {
  constructor(private readonly TicketsService: TicketsService) {}

  @Post('book')
  // @HttpCode(HttpStatus.CREATED)
  // @UseGuards(AuthGuard)
  // @Roles(['admin', 'user'])
  @AllowAnonymous()
  async createTickets(
    @Body() bookTicketsDto: BookTicketsDto,
    // @Session() session: UserSession,
  ) {
    // return this.TicketsService.bookTickets(bookTicketsDto, session.user.id);
    return this.TicketsService.bookTickets(bookTicketsDto);
  }
  
}
