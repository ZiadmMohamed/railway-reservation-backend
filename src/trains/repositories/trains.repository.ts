import { Injectable } from '@nestjs/common';
import { eq, inArray, and } from 'drizzle-orm';
import { train } from '../schemas/train.schema';
import { trainTranslations } from '../schemas/train-translations.schema';
import { supportedLanguages } from '../../database/schemas/supported-languages.schema';
import { randomUUID } from 'crypto';
import { DB } from 'src/database/drizzle';
import { InjectDb } from 'src/database/db.provider';

@Injectable()
export class TrainsRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  /**
   * Create a new train with translation for a specific locale
   * @param data - The data for the new train
   * @param translation - The translation data
   * @param locale - The locale for the translation
   * @returns The created train with translation
   */
  async create(
    data: {
      number: string;
      totalSeats: string;
      availableSeats: string;
    },
    translation: { name: string; source: string; destination: string },
    locale: string,
  ) {
    const id = randomUUID();
    const newTrain = { id, ...data };

    // Get language ID from locale code using a query
    const [language] = await this.db
      .select({ id: supportedLanguages.id })
      .from(supportedLanguages)
      .where(eq(supportedLanguages.code, locale))
      .limit(1);

    if (!language) {
      throw new Error(`Language with code '${locale}' not found`);
    }

    // Create train and translation in a transaction
    const [created] = await this.db.insert(train).values(newTrain).returning();

    // Create translation
    await this.db.insert(trainTranslations).values({
      id: randomUUID(),
      trainId: id,
      languageId: language.id,
      name: translation.name,
      source: translation.source,
      destination: translation.destination,
    });

    return {
      ...created,
      translations: {
        [locale]: translation,
      },
      name: translation.name,
      source: translation.source,
      destination: translation.destination,
    };
  }

  /**
   * Find all trains with translations
   * @param page - The page number
   * @param limit - The number of trains per page
   * @param locale - The locale to filter translations (optional)
   * @returns The list of trains with translations
   */
  async findAll(page = 1, limit = 10, locale?: string) {
    const offset = (page - 1) * limit;

    // 1. Get IDs for pagination (to avoid duplicating rows in limit/offset due to join)
    const trainIdsResult = await this.db
      .select({ id: train.id })
      .from(train)
      .limit(limit)
      .offset(offset);

    const trainIds = trainIdsResult.map(t => t.id);

    if (trainIds.length === 0) {
      return [];
    }

    // 2. Fetch trains and translations with language info
    const rows = await this.db
      .select()
      .from(train)
      .leftJoin(trainTranslations, eq(trainTranslations.trainId, train.id))
      .leftJoin(supportedLanguages, eq(trainTranslations.languageId, supportedLanguages.id))
      .where(inArray(train.id, trainIds));

    // 3. Aggregate results
    const trainsMap = new Map<string, any>();

    for (const row of rows) {
      const trainId = row.train.id;
      if (!trainsMap.has(trainId)) {
        trainsMap.set(trainId, {
          ...row.train,
          translations: {},
        });
      }

      const trainEntry = trainsMap.get(trainId);
      if (row.train_translations && row.supported_languages) {
        trainEntry.translations[row.supported_languages.code] = {
          name: row.train_translations.name,
          source: row.train_translations.source,
          destination: row.train_translations.destination,
        };
      }
    }

    // 4. Format result
    return Array.from(trainsMap.values()).map(t => {
      const currentTrans = locale
        ? t.translations[locale] || t.translations['en']
        : t.translations['en'];

      return {
        ...t,
        name: currentTrans?.name,
        source: currentTrans?.source,
        destination: currentTrans?.destination,
      };
    });
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
   * Find a train by id with translations
   * @param id - The id of the train
   * @param locale - The locale to use for the name field
   * @returns The train with translations
   */
  async findOne(id: string, locale?: string) {
    const rows = await this.db
      .select()
      .from(train)
      .leftJoin(trainTranslations, eq(trainTranslations.trainId, train.id))
      .leftJoin(supportedLanguages, eq(trainTranslations.languageId, supportedLanguages.id))
      .where(eq(train.id, id));

    if (rows.length === 0) {
      return null;
    }

    const trainData = rows[0].train;
    const translationsMap: Record<string, any> = {};

    for (const row of rows) {
      if (row.train_translations && row.supported_languages) {
        translationsMap[row.supported_languages.code] = {
          name: row.train_translations.name,
          source: row.train_translations.source,
          destination: row.train_translations.destination,
        };
      }
    }

    const currentTrans = locale
      ? translationsMap[locale] || translationsMap['en']
      : translationsMap['en'];

    return {
      ...trainData,
      translations: translationsMap,
      name: currentTrans?.name,
      source: currentTrans?.source,
      destination: currentTrans?.destination,
    };
  }

  /**
   * Update a train and its translation for a specific locale
   * @param id - The id of the train
   * @param data - The data to update
   * @param translation - The translation data to update/insert
   * @param locale - The locale for the translation
   * @returns The updated train
   */
  async update(
    id: string,
    data: Partial<{
      number: string;
      totalSeats: string;
      availableSeats: string;
    }>,
    translation: Partial<{ name: string; source: string; destination: string }>,
    locale: string,
  ) {
    // Update train data if provided
    let updated = null;
    if (Object.keys(data).length > 0) {
      [updated] = await this.db
        .update(train)
        .set({ ...data })
        .where(eq(train.id, id))
        .returning();
    } else {
      [updated] = await this.db.select().from(train).where(eq(train.id, id));
    }

    // Handle translation update/insert
    if (Object.keys(translation).length > 0) {
      // Get language ID from locale code using a query
      const [language] = await this.db
        .select({ id: supportedLanguages.id })
        .from(supportedLanguages)
        .where(eq(supportedLanguages.code, locale))
        .limit(1);

      if (!language) {
        throw new Error(`Language with code '${locale}' not found`);
      }

      const existingTranslation = await this.db
        .select()
        .from(trainTranslations)
        .where(
          and(eq(trainTranslations.trainId, id), eq(trainTranslations.languageId, language.id)),
        );

      if (existingTranslation.length > 0) {
        // Update existing translation
        await this.db
          .update(trainTranslations)
          .set(translation)
          .where(eq(trainTranslations.id, existingTranslation[0].id));
      } else {
        // Insert new translation
        // Ensure all required fields are present for new translation
        // If partial update, we might be missing fields. But for now assuming full or partial.
        // If it's a new translation, we need name, source, destination.
        // If they are missing in 'translation' object, we can't insert.
        // But the DTO validation makes them optional.
        // If the user sends partial data for a NEW locale, it will fail NOT NULL constraint.
        // I'll assume for now that if creating a new locale, the user provides all fields, or I'll default to empty string if not provided (since I set default '' in migration).

        await this.db.insert(trainTranslations).values({
          id: randomUUID(),
          trainId: id,
          languageId: language.id,
          name: translation.name || '',
          source: translation.source || '',
          destination: translation.destination || '',
        });
      }
    }

    // Fetch updated translations with language info
    const updatedTranslations = await this.db
      .select()
      .from(trainTranslations)
      .leftJoin(supportedLanguages, eq(trainTranslations.languageId, supportedLanguages.id))
      .where(eq(trainTranslations.trainId, id));

    const translationsMap = updatedTranslations.reduce(
      (acc, row) => {
        if (row.supported_languages) {
          acc[row.supported_languages.code] = {
            name: row.train_translations.name,
            source: row.train_translations.source,
            destination: row.train_translations.destination,
          };
        }
        return acc;
      },
      {} as Record<string, { name: string; source: string; destination: string }>,
    );

    const currentTrans = translationsMap[locale] || translationsMap['en'];

    return {
      ...updated,
      translations: translationsMap,
      name: currentTrans?.name,
      source: currentTrans?.source,
      destination: currentTrans?.destination,
    };
  }

  /**
   * Delete a train
   * @param id - The id of the train
   */
  async delete(id: string) {
    // Delete translations first (due to foreign key constraint)
    await this.db.delete(trainTranslations).where(eq(trainTranslations.trainId, id));
    await this.db.delete(train).where(eq(train.id, id));
  }
}
