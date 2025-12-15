import { TripsService } from './trips.service';
import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
@AllowAnonymous()
// @Roles(["admin"])
// @UseGuards(AuthGuard) // التأكد من تسجيل دخول المستخدم أولاً
 @ApiOperation({ summary: 'Create a new train' })
 @ApiResponse({
    status: 201,
   description: 'Train created successfully',
  })
async CreateTrip(@Body() body:CreateTripDTO){
  const data=  await this.tripsService.CreateTrip(body)
    return {message:"trip created successfully",data}

}

  @Patch(':id')
   @ApiOperation({ summary: 'update  train' })
 @ApiResponse({
    status: 201,
   description: 'Train updated successfully',
  })
  @Roles(["admin"])
@UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTripDto,
    @Session() session: UserSession,
  ) {
    const data = await this.tripsService.Updatetrip(
      id,
      session.user.id,
      body,
    );

    return {
      message: 'trip updated successfully',
      data,
    };
  }


}
