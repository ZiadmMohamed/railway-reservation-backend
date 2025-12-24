import { Injectable } from '@nestjs/common';
import { InjectDb } from 'src/database/db.provider';
import { DB } from 'src/database/drizzle';
import { stations } from '../schemas/stations.schema';
import { eq } from 'drizzle-orm';
import { CreateStationDto } from '../DTO/station.DTO';

@Injectable()
export class stationRepo {
  constructor(@InjectDb() private readonly db: DB) {}
  async create(
    stationArabicName: CreateStationDto['stationArabicName'],
    stationEnglishName: CreateStationDto['stationEnglishName'],
  ) {
    const created = await this.db
      .insert(stations)
      .values({ stationArabicName, stationEnglishName })
      .returning();
    return created[0];
  }
  async findOne(id: string) {
    const [result] = await this.db.select().from(stations).where(eq(stations.id, id));
    return result ?? null;
  }
}
