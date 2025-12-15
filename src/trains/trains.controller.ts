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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
// import { TrainsService } from './trains.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { TrainResponseDto } from './dto/train-response.dto';
import { PaginationQueryParams } from '../common/dtos/pagination.query-params.dto';
import { AllowAnonymous, AuthGuard, AuthModule, Roles } from '@thallesp/nestjs-better-auth';
import { I18n, I18nContext } from 'nestjs-i18n';
import { TrainsService } from './trains.service';

@ApiTags('Trains')
@AllowAnonymous()
@Controller('trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
//   @UseGuards(AuthGuard)
  @ApiBearerAuth()
//   @Roles(["admin"])
@AllowAnonymous()
  @ApiOperation({ summary: 'Create a new train' })
  @ApiResponse({
    status: 201,
    description: 'Train created successfully',
    
  })
  async create(@Body() createTrainDto: CreateTrainDto) {
    const train = await this.trainsService.create(createTrainDto);

    return {
      message:"train created successfully",
      data: train,
    };
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
  async findAll(@Query() query: PaginationQueryParams, @I18n() i18n: I18nContext) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const result = await this.trainsService.findAll(page, limit);

    return {
      message: i18n.t('train.list'),
      ...result,
    };
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
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const train = await this.trainsService.findOne(id);

    return {
      message: i18n.t('train.found'),
      data: train,
    };
  }

//   @Patch(':id')
//   @ApiOperation({ summary: 'Update a train' })
//   @ApiParam({ name: 'id', description: 'Train ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Train updated successfully',
//     type: TrainResponseDto,
//   })
//   @ApiResponse({ status: 404, description: 'Train not found' })
//   async update(
//     @Param('id') id: string,
//     @Body() updateTrainDto: UpdateTrainDto,
//     @I18n() i18n: I18nContext,
//   ) {
//     const train = await this.trainsService.update(id, updateTrainDto, i18n.lang);

//     return {
//       message: i18n.t('train.updated'),
//       data: train,
//     };
//   }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a train' })
  @ApiParam({ name: 'id', description: 'Train ID' })
  @ApiResponse({ status: 200, description: 'Train deleted successfully' })
  @ApiResponse({ status: 404, description: 'Train not found' })
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.trainsService.remove(id);

    return {
      message: i18n.t('train.deleted'),
    };
  }
}
