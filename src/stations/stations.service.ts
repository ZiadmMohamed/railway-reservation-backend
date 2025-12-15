import { Injectable } from "@nestjs/common";
import { CreateStationDto } from "./DTO/station.DTO";
import { stationRepo } from "./repository/station.repo";

@Injectable()
export class StationService{
    constructor(private readonly stationRepo:stationRepo){}

    async create(stationArabicName:string,stationEnglishName:string){
        const data=await this.stationRepo.create(stationArabicName,stationEnglishName)
        console.log(data);
        
return data
    }
}