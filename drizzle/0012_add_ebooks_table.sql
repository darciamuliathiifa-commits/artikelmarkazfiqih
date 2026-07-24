CREATE TABLE "ebooks" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"cover_image_url" text,
	"preview_images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"purchase_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ebooks_slug_unique" UNIQUE("slug")
);
