CREATE TABLE "train" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"number" text NOT NULL,
	"source" text NOT NULL,
	"destination" text NOT NULL,
	"total_seats" text NOT NULL,
	"available_seats" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "train_number_unique" UNIQUE("number")
);
