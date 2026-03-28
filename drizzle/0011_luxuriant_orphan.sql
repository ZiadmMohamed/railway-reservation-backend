CREATE TABLE "onboarding_screens" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" varchar(255),
	"order_index" integer,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "onboarding_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"screen_id" integer,
	"language_id" text,
	"title" text,
	"subtitle" text,
	"primary_label" varchar(255),
	"primary_action" varchar(255),
	"secondary_label" varchar(255),
	"secondary_action" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "onboarding_translations" ADD CONSTRAINT "onboarding_translations_screen_id_onboarding_screens_id_fk" FOREIGN KEY ("screen_id") REFERENCES "public"."onboarding_screens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_translations" ADD CONSTRAINT "onboarding_translations_language_id_supported_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."supported_languages"("id") ON DELETE cascade ON UPDATE no action;