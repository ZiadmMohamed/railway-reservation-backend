import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB } from 'src/database/drizzle';
import { InjectDb } from 'src/database/db.provider';
import { passenger } from '../schemas/passenger.schema';
import { CreatePassengerDto } from '../dto/create-passenger.dto';
import { UpdatePassengerDto } from '../dto/update-passenger.dto';

@Injectable()
export class PassengerRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  /**
   * Create a passenger
   * @param nationalId - The national id of the passenger
   * @param passengerName - The name of the passenger
   * @param userId - The id of the user
   * @returns The created passenger
   */
  async create(
    nationalId: CreatePassengerDto['nationalId'],
    passengerName: CreatePassengerDto['passengerName'],
    userId: string,
  ) {
    const created = await this.db
      .insert(passenger)
      .values({ nationalId, passengerName, userId })
      .onConflictDoNothing()
      .returning();
    return created[0];
  }

  /**
   * Find all passengers
   * @param page - The page number
   * @param limit - The number of passengers per page
   * @returns The passengers
   */
  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const passengers = await this.db.select().from(passenger).limit(limit).offset(offset);

    return passengers;
  }

  /**
   * Count the number of passengers
   * @returns The number of passengers
   */
  async count() {
    const result = await this.db.select().from(passenger);
    return result.length;
  }

  /**
   * Find a passenger by id
   * @param id - The id of the passenger
   * @returns The passenger or null if not found
   */
  async findOne(id: string) {
    const [result] = await this.db.select().from(passenger).where(eq(passenger.id, id));

    return result ?? null;
  }

  /**
   * Update a passenger
   * @param id - The id of the passenger
   * @param data - The data to update
   * @returns The updated passenger
   */
  async update(id: string, data: UpdatePassengerDto) {
    const [updated] = await this.db
      .update(passenger)
      .set(data)
      .where(eq(passenger.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete a passenger
   * @param id - The id of the passenger
   */
  async delete(id: string) {
    await this.db.delete(passenger).where(eq(passenger.id, id));
  }
}
