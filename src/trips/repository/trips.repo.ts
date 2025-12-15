import { Injectable } from "@nestjs/common";
import { InjectDb } from "src/database/db.provider";
import { DB } from "src/database/drizzle";
import { CreateTrainDto } from "src/trains/dto/create-train.dto";
import { CreateTripDTO } from "../DTO/create-trip.DTO";
import { trips } from "../schemas/trips.schema";
import { eq } from "drizzle-orm";
import { UpdateTripDto } from "../DTO/update.trip.DTO";

@Injectable()
export class TripsRepo{
    constructor(@InjectDb() private readonly db: DB){

    }
      async create(
     {   trainId,
        destinationFrom,
        destinationTo,
        departureDate}:CreateTripDTO
      ) {
        const created = await this.db
          .insert(trips)
          .values({ trainId,
        destinationFrom,
        destinationTo,
        departureDate})
          .onConflictDoNothing()
          .returning();
        return created[0];
      }

        async update(id: string, data: UpdateTripDto) {
          const [updated] = await this.db
            .update(trips)
            .set(data)
            .where(eq(trips.id, id))
            .returning();
      
          return updated;
        }
       async findOne(id: string){
           const [result] = await this.db
             .select()
             .from(trips)
             .where(eq(trips.id, id));
           return result ?? null;
         }
}