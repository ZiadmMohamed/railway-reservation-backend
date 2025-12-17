import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';

/**
 * Supported languages table
 * Stores all languages supported by the application
 */
export const supportedLanguages = pgTable('supported_languages', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(), // e.g., 'en', 'ar', 'fr'
  name: text('name').notNull(), // e.g., 'English', 'Arabic', 'French'
  nativeName: text('native_name').notNull(), // e.g., 'English', 'العربية', 'Français'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
