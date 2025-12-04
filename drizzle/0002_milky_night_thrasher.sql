CREATE TABLE "train_translations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"train_id" text NOT NULL,
	"locale" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "train_translations" ADD CONSTRAINT "train_translations_train_id_train_id_fk" FOREIGN KEY ("train_id") REFERENCES "public"."train"("id") ON DELETE no action ON UPDATE no action;