import { pgTable, text } from 'drizzle-orm/pg-core';
import { train } from './train.schema';
import { supportedLanguages } from '../../database/schemas/supported-languages.schema';

export const trainTranslations = pgTable('train_translations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  source: text('source').notNull(),
  destination: text('destination').notNull(),
  trainId: text('train_id')
    .notNull()
    .references(() => train.id),
  languageId: text('language_id')
    .notNull()
    .references(() => supportedLanguages.id),
});
