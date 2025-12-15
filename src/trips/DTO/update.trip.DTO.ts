import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDTO } from "./create-trip.DTO";



export class UpdateTripDto extends PartialType(CreateTripDTO) {}