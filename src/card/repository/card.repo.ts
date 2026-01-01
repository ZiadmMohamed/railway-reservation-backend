import { Injectable } from '@nestjs/common';
import { InjectDb } from 'src/database/db.provider';
import { DB } from 'src/database/drizzle';

@Injectable()
export class CardRepository {
  constructor(@InjectDb() private readonly db: DB) {}
}
