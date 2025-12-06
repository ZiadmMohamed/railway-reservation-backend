CREATE TABLE "passenger" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"national_id" text NOT NULL,
	"passenger_name" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "passenger_user_id_national_id_unique" UNIQUE("user_id","national_id")
);
--> statement-breakpoint
ALTER TABLE "passenger" ADD CONSTRAINT "passenger_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;