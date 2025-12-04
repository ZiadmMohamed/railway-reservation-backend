ALTER TABLE "train_translations" ADD COLUMN "source" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "train_translations" ADD COLUMN "destination" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "train" DROP COLUMN "source";--> statement-breakpoint
ALTER TABLE "train" DROP COLUMN "destination";