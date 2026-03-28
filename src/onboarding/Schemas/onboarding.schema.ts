import { pgTable, serial, varchar, boolean, text, integer } from 'drizzle-orm/pg-core';
import { supportedLanguages } from './supported-languages.schema';

export const onboardingScreens = pgTable('onboarding_screens', {
  id: serial('id').primaryKey(),
  imageUrl: varchar('image_url', { length: 255 }),
  orderIndex: integer('order_index'),
  isActive: boolean('is_active').default(true),
});

export const onboardingTranslations = pgTable('onboarding_translations', {
  id: serial('id').primaryKey(),
  screenId: integer('screen_id').references(() => onboardingScreens.id, {
    onDelete: 'cascade',
  }),
  languageId: text('language_id').references(() => supportedLanguages.id),
  title: text('title'),
  subtitle: text('subtitle'),
  primaryLabel: varchar('primary_label', { length: 255 }),
  primaryAction: varchar('primary_action', { length: 255 }),
  secondaryLabel: varchar('secondary_label', { length: 255 }),
  secondaryAction: varchar('secondary_action', { length: 255 }),
});
