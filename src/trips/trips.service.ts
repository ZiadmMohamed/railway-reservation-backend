import { TrainsRepository } from './../trains/repositories/trains.repository';
import { TripsRepo } from './repository/trips.repo';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDTO } from './DTO/create-trip.DTO';
import { UpdateTripDto } from './DTO/update.trip.DTO';
import { stationRepo } from 'src/stations/repository/station.repo';

@Injectable()
export class TripsService {
    constructor(private readonly tripsRepo:TripsRepo,
        private readonly trainsRepository:TrainsRepository,
        private readonly stationRepo:stationRepo,
    ){}


    async CreateTrip(body:CreateTripDTO){
     const train=   await this.trainsRepository.findOne(body.trainId)
     if(!train){
        throw new NotFoundException("train not found");
     }
     const destinationFrom=await this.stationRepo.findOne(body.destinationFrom)
     if(!destinationFrom){
                throw new NotFoundException("destinationFrom not found");

     }
       const destinationTo=await this.stationRepo.findOne(body.destinationTo)
     if(!destinationTo){
                throw new NotFoundException("destinationTo not found");

     }
     return   await this.tripsRepo.create({...body})
    }
    async findOne(id: string) {
        const trip = await this.tripsRepo.findOne(id);
    
        if (!trip) {
          throw new NotFoundException('trip not found');
        }
    
        return trip;
      }
    async Updatetrip(id:string,
      body:UpdateTripDto){
await this.findOne(id)
 const updatedtrip = await this.tripsRepo.update(id, body);
    if (!updatedtrip) throw new BadRequestException('Failed to update trip');

    return updatedtrip;
        
    }
}
