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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TrainsService } from './trains.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { TrainResponseDto } from './dto/train-response.dto';
import { PaginationQueryParams } from '../common/dtos/pagination.query-params.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('Trains')
@Controller('api/trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new train' })
  @AllowAnonymous()
  @ApiResponse({
    status: 201,
    description: 'Train created successfully',
    type: TrainResponseDto,
  })
  create(@Body() createTrainDto: CreateTrainDto) {
    return this.trainsService.create(createTrainDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trains with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of trains',
    type: [TrainResponseDto],
  })
  findAll(@Query() query: PaginationQueryParams) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    return this.trainsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a train by ID' })
  @ApiParam({ name: 'id', description: 'Train ID' })
  @ApiResponse({
    status: 200,
    description: 'Train found',
    type: TrainResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Train not found' })
  findOne(@Param('id') id: string) {
    return this.trainsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a train' })
  @ApiParam({ name: 'id', description: 'Train ID' })
  @ApiResponse({
    status: 200,
    description: 'Train updated successfully',
    type: TrainResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Train not found' })
  update(@Param('id') id: string, @Body() updateTrainDto: UpdateTrainDto) {
    return this.trainsService.update(id, updateTrainDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a train' })
  @ApiParam({ name: 'id', description: 'Train ID' })
  @ApiResponse({ status: 204, description: 'Train deleted successfully' })
  @ApiResponse({ status: 404, description: 'Train not found' })
  remove(@Param('id') id: string) {
    return this.trainsService.remove(id);
  }
}
