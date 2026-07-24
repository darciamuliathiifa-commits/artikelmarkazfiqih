CREATE TABLE "agenda" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text DEFAULT 'rutin' NOT NULL,
	"schedule_text" text NOT NULL,
	"description" text,
	"pengajar" text,
	"image_url" text,
	"link_url" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
