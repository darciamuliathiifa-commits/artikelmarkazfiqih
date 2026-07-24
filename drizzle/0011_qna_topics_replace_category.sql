ALTER TABLE "qna_topics" ADD COLUMN "slug" text;--> statement-breakpoint
UPDATE "qna_topics" SET "slug" = lower(regexp_replace(regexp_replace(trim("name"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g')) WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "qna_topics" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "qna_topics" ADD CONSTRAINT "qna_topics_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "qna" ADD COLUMN "topic_id" text;--> statement-breakpoint
ALTER TABLE "qna" ADD CONSTRAINT "qna_topic_id_qna_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."qna_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qna" DROP COLUMN "category_id";
