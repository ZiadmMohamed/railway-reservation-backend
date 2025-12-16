import { CreateStationDto } from './DTO/station.DTO';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StationService } from './stations.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, AuthGuard, Roles } from '@thallesp/nestjs-better-auth';
import { anonymous } from 'better-auth/plugins';

@Injectable()
@ApiTags('stations')
@Controller('station')
export class StationController {
  constructor(private readonly stationService: StationService) {}
  @Post()
  @UseGuards(AuthGuard) // التأكد من تسجيل دخول المستخدم أولاً
  @HttpCode(HttpStatus.CREATED)

  // @AllowAnonymous()
  @Roles(['admin'])
  @ApiOperation({ summary: 'Create a new satiton' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'station created successfully',
  })
  async createStation(@Body() body: CreateStationDto) {
    console.log(body);

    const data = await this.stationService.create(body.stationArabicName, body.stationEnglishName);
    return { message: 'station created', data };
  }
}
