import { TripsService } from './trips.service';
import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, Session, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTripDTO } from './DTO/create-trip.DTO';
import { AllowAnonymous, AuthGuard, Roles, UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateTripDto } from './DTO/update.trip.DTO';
@ApiTags('trips')
@Controller('trips')
export class TripsController {
    constructor(        private readonly tripsService:TripsService
){}
@Post()
@HttpCode(HttpStatus.CREATED)
@ApiBearerAuth()
// @AllowAnonymous()
@Roles(["admin"])
@UseGuards(AuthGuard) // التأكد من تسجيل دخول المستخدم أولاً
 @ApiOperation({ summary: 'Create a new trip' })
 @ApiResponse({
    status: 201,
   description: 'trip created successfully',
  })
async CreateTrip(@Body() body:CreateTripDTO){
  const data=  await this.tripsService.CreateTrip(body)
    return {message:"trip created successfully",data}

}

  @Patch(':id')
   @ApiOperation({ summary: 'update  trip' })
 @ApiResponse({
    status: 201,
   description: 'trip updated successfully',
  })
  // @Roles(["admin"])
// @UseGuards(AuthGuard)
@AllowAnonymous()
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTripDto,
  ) {
    const data = await this.tripsService.Updatetrip(
      id,
  
      body,
    );

    return {
      message: 'trip updated successfully',
      data,
    };
  }


}
