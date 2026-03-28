<<<<<<< HEAD
import { pgTable, text } from 'drizzle-orm/pg-core';
import { train } from './train.schema';
import { supportedLanguages } from '../../onboarding/Schemas/supported-languages.schema';
=======
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { trains } from './train.schema';
import { supportedLanguages } from '../../database/schemas/supported-languages.schema';
>>>>>>> origin/main

export const trainTranslations = pgTable('train_translations', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  source: text('source').notNull(),
  destination: text('destination').notNull(),
  trainId: uuid('train_id')
    .notNull()
    .references(() => trains.id),
  languageId: text('language_id')
    .notNull()
    .references(() => supportedLanguages.id),
});

export const trainTranslationsRelations = relations(trainTranslations, ({ one }) => ({
  train: one(trains, {
    fields: [trainTranslations.trainId],
    references: [trains.id],
  }),
  language: one(supportedLanguages, {
    fields: [trainTranslations.languageId],
    references: [supportedLanguages.id],
  }),
}));
