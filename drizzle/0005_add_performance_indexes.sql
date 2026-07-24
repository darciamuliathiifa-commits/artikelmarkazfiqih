CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles (is_published, published_at DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS articles_category_id_idx ON articles (category_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS articles_author_id_idx ON articles (author_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS qna_created_at_idx ON qna (is_published, created_at DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS qna_category_id_idx ON qna (category_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);
