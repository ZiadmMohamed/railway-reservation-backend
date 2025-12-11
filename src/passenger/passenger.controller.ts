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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PassengerService } from './passenger.service';
import { CreatePassenger } from './dto/create-passenger.dto';
import { UpdatePassenger } from './dto/update-passenger.dto';
import { Passenger } from './dto/passenger.dto';
import { PaginationQueryParams } from '../common/dtos/pagination.query-params.dto';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { SinglePassengerResponseDto, PassengerListResponseDto } from './dto/passenger-response.dto';

@ApiTags('Passengers')
@Controller('passengers')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPassenger: CreatePassenger,
    @Session() session: UserSession,
  ): Promise<SinglePassengerResponseDto> {
    const userId = session.user.id;

    const passenger = await this.passengerService.create(
      createPassenger.nationalId,
      createPassenger.passengerName,
      userId,
    );

    return {
      message: 'Passenger created successfully',
      data: new Passenger(passenger),
    };
  }

  @Get()
  async findAll(
    @Query() query: PaginationQueryParams,
    @Session() session: UserSession,
  ): Promise<PassengerListResponseDto> {
    const result = await this.passengerService.findAll(session.user.id, query.page, query.limit);

    return {
      message: 'Passengers list',
      data: Passenger.fromArray(result.data),
      meta: result.meta,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePassenger: UpdatePassenger,
    @Session() session: UserSession,
  ): Promise<SinglePassengerResponseDto> {
    const updatedPassenger = await this.passengerService.update(
      id,
      session.user.id,
      updatePassenger,
    );

    return {
      message: 'Passenger updated successfully',
      data: new Passenger(updatedPassenger),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @Session() session: UserSession,
  ): Promise<SinglePassengerResponseDto> {
    await this.passengerService.remove(id, session.user.id);

    return {
      message: 'Passenger deleted successfully',
    };
  }
}
