import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { PaginationQueryParams } from '../common/dtos/pagination.query-params.dto';
import { SingleTripResponseDto, TripListResponseDto } from './dto/trip-response.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}


  @Get()
  async findAll(
    @Query() query: PaginationQueryParams,
  ): Promise<TripListResponseDto> {
    const result = await this.tripsService.getAllTrips(
      query.page,
      query.limit,
    );

    return {
      message: 'Trips list',
      data: result.data,
      meta: result.meta,
    };
  }



  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<SingleTripResponseDto> {
    const trip = await this.tripsService.getTripById(id);

    return {
      message: 'Trip details',
      data: trip,
    };
  }


  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
  ): Promise<SingleTripResponseDto> {
    await this.tripsService.deleteTripById(id);

    return {
      message: 'Trip deleted successfully',
    };
  }
}
