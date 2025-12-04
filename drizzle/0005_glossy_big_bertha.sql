-- Step 1: Create the supported_languages table
CREATE TABLE "supported_languages" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"native_name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "supported_languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint

-- Step 2: Seed supported_languages with existing locales from train_translations
-- Insert unique locales as supported languages
INSERT INTO "supported_languages" ("id", "code", "name", "native_name", "is_active", "created_at", "updated_at")
SELECT 
  gen_random_uuid()::text as id,
  locale as code,
  CASE 
    WHEN locale = 'en' THEN 'English'
    WHEN locale = 'ar' THEN 'Arabic'
    WHEN locale = 'fr' THEN 'French'
    WHEN locale = 'es' THEN 'Spanish'
    WHEN locale = 'de' THEN 'German'
    ELSE locale
  END as name,
  CASE 
    WHEN locale = 'en' THEN 'English'
    WHEN locale = 'ar' THEN 'العربية'
    WHEN locale = 'fr' THEN 'Français'
    WHEN locale = 'es' THEN 'Español'
    WHEN locale = 'de' THEN 'Deutsch'
    ELSE locale
  END as native_name,
  true as is_active,
  now() as created_at,
  now() as updated_at
FROM (SELECT DISTINCT locale FROM "train_translations" WHERE locale IS NOT NULL) AS unique_locales
ON CONFLICT (code) DO NOTHING;
--> statement-breakpoint

-- Step 3: Add a temporary column to store the language_id
ALTER TABLE "train_translations" ADD COLUMN "language_id_temp" text;
--> statement-breakpoint

-- Step 4: Update the temporary column with the corresponding language_id
UPDATE "train_translations" 
SET "language_id_temp" = "supported_languages"."id"
FROM "supported_languages"
WHERE "train_translations"."locale" = "supported_languages"."code";
--> statement-breakpoint

-- Step 5: Drop the old locale column
ALTER TABLE "train_translations" DROP COLUMN "locale";
--> statement-breakpoint

-- Step 6: Rename the temporary column to language_id
ALTER TABLE "train_translations" RENAME COLUMN "language_id_temp" TO "language_id";
--> statement-breakpoint

-- Step 7: Make language_id NOT NULL
ALTER TABLE "train_translations" ALTER COLUMN "language_id" SET NOT NULL;
--> statement-breakpoint

-- Step 8: Add the foreign key constraint
ALTER TABLE "train_translations" ADD CONSTRAINT "train_translations_language_id_supported_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."supported_languages"("id") ON DELETE no action ON UPDATE no action;