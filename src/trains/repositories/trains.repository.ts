import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { train } from '../schemas/train.schema';
import { randomUUID } from 'crypto';
import { DB } from 'src/database/drizzle';
import { InjectDb } from 'src/database/db.provider';

@Injectable()
export class TrainsRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  /**
   * Create a new train
   * @param data - The data for the new train
   * @returns The created train
   */
  async create(data: {
    name: string;
    number: string;
    source: string;
    destination: string;
    totalSeats: string;
    availableSeats: string;
  }) {
    const id = randomUUID();
    const newTrain = { id, ...data };

    const [created] = await this.db.insert(train).values(newTrain).returning();
    return created;
  }

  /**
   * Find all trains
   * @param page - The page number
   * @param limit - The number of trains per page
   * @returns The list of trains
   */
  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const trains = await this.db.select().from(train).limit(limit).offset(offset);
    return trains;
  }

  /**
   * Count the number of trains
   * @returns The number of trains
   */
  async count() {
    const result = await this.db.select().from(train);
    return result.length;
  }

  /**
   * Find a train by id
   * @param id - The id of the train
   * @returns The train
   */
  async findOne(id: string) {
    const [found] = await this.db.select().from(train).where(eq(train.id, id));
    return found;
  }

  /**
   * Update a train
   * @param id - The id of the train
   * @param data - The data to update the train with
   * @returns The updated train
   */
  async update(id: string, data: Partial<typeof train.$inferInsert>) {
    const [updated] = await this.db.update(train).set(data).where(eq(train.id, id)).returning();
    return updated;
  }

  /**
   * Delete a train
   * @param id - The id of the train
   */
  async delete(id: string) {
    await this.db.delete(train).where(eq(train.id, id));
  }
}
