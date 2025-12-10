import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { supportedLanguages } from '../Schemas/supported-languages.schema';
import { DB } from '../../database/drizzle';
import { InjectDb } from '../../database/db.provider';

@Injectable()
export class LanguagesRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  /**
   * Find a language by its code (e.g., 'en', 'ar', 'fr')
   * @param code - The language code
   * @returns The language or null if not found
   */
  async findByCode(code: string) {
    const [language] = await this.db
      .select()
      .from(supportedLanguages)
      .where(eq(supportedLanguages.code, code))
      .limit(1);

    return language || null;
  }

  /**
   * Find a language by its ID
   * @param id - The language ID
   * @returns The language or null if not found
   */
  async findById(id: string) {
    const [language] = await this.db
      .select()
      .from(supportedLanguages)
      .where(eq(supportedLanguages.id, id))
      .limit(1);

    return language || null;
  }

  /**
   * Get all active languages
   * @returns Array of active languages
   */
  async findAllActive() {
    return this.db.select().from(supportedLanguages).where(eq(supportedLanguages.isActive, true));
  }

  /**
   * Get all languages
   * @returns Array of all languages
   */
  async findAll() {
    return this.db.select().from(supportedLanguages);
  }
}
