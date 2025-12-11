import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DB } from 'src/database/drizzle';
import { InjectDb } from 'src/database/db.provider';
import { Passenger, passenger } from '../schemas/passenger.schema';
import { CreatePassenger } from '../dto/create-passenger.dto';
import { UpdatePassenger } from '../dto/update-passenger.dto';

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
    nationalId: CreatePassenger['nationalId'],
    passengerName: CreatePassenger['passengerName'],
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
  async findAll(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const passengers = await this.db.select().from(passenger).limit(limit).offset(offset);

    return passengers;
  }

  /**
   * Count the number of passengers
   * @returns The number of passengers
   */
  async count(userId: string) {
    const result = await this.db.select().from(passenger).where(eq(passenger.userId, userId));
    return result.length;
  }

  /**
   * Find a passenger by id
   * @param id - The id of the passenger
   * @param userId - The id of the user
   * @returns The passenger or null if not found
   */
  async findOne(id: string, userId: string): Promise<Passenger | null> {
    const [result] = await this.db
      .select()
      .from(passenger)
      .where(and(eq(passenger.id, id), eq(passenger.userId, userId)));
    return result ?? null;
  }

  /**
   * Update a passenger
   * @param id - The id of the passenger
   * @param data - The data to update
   * @returns The updated passenger
   */
  async update(id: string, data: UpdatePassenger) {
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
  async delete(id: string, userId: string) {
    await this.db.delete(passenger).where(and(eq(passenger.id, id), eq(passenger.userId, userId)));
  }
}
