CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS articles_title_trgm_idx ON articles USING gin (title gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS articles_excerpt_trgm_idx ON articles USING gin (excerpt gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS articles_content_trgm_idx ON articles USING gin (content gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS qna_title_trgm_idx ON qna USING gin (title gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS qna_question_trgm_idx ON qna USING gin (question gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS qna_answer_trgm_idx ON qna USING gin (answer gin_trgm_ops);
