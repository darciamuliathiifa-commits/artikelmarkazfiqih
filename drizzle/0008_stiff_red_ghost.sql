CREATE TABLE "qna_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qna_topics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "topic" text;