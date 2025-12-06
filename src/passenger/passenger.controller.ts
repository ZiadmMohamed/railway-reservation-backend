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
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { PassengerDto } from './dto/passenger-response.dto';
import { PaginationQueryParams } from '../common/dtos/pagination.query-params.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ResponseDto } from 'src/common/dtos/response.dto';

@ApiTags('Passengers')
@AllowAnonymous()
@Controller('api/passengers')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPassengerDto: CreatePassengerDto): Promise<ResponseDto> {
    const userId = '7KwL4UDRMfjqYHZMUILdh8AO9EaVcwpe';
    const passenger = await this.passengerService.create(
      createPassengerDto.nationalId,
      createPassengerDto.passengerName,
      userId,
    );

    return {
      message: 'Passenger created successfully',
      data: new PassengerDto(passenger),
    };
  }

  @Get()
  async findAll(@Query() query: PaginationQueryParams): Promise<ResponseDto> {
    const result = await this.passengerService.findAll(query.page, query.limit);

    return {
      message: 'Passengers list',
      ...result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePassengerDto: UpdatePassengerDto,
  ): Promise<ResponseDto> {
    const updatedPassenger = await this.passengerService.update(id, updatePassengerDto);

    return {
      message: 'Passenger updated successfully',
      data: new PassengerDto(updatedPassenger),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<ResponseDto> {
    await this.passengerService.remove(id);

    return {
      message: 'Passenger deleted successfully',
    };
  }
}
