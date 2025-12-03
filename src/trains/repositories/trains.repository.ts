import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { train } from '../schemas/train.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class TrainsRepository {
  constructor(private readonly db: any) {}

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

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const trains = await this.db.select().from(train).limit(limit).offset(offset);
    return trains;
  }

  async count() {
    const result = await this.db.select().from(train);
    return result.length;
  }

  async findOne(id: string) {
    const [found] = await this.db.select().from(train).where(eq(train.id, id));
    return found;
  }

  async update(id: string, data: Partial<typeof train.$inferInsert>) {
    const [updated] = await this.db.update(train).set(data).where(eq(train.id, id)).returning();
    return updated;
  }

  async delete(id: string) {
    await this.db.delete(train).where(eq(train.id, id));
  }
}
