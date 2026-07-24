import Link from "next/link";
import Image from "next/image";

import type { ArticleListItem } from "@/lib/data/articles";
import type { AuthorProfile } from "@/lib/data/authors";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

export function AuthorOtherArticles({
  author,
  articles,
}: {
  author: AuthorProfile;
  articles: ArticleListItem[];
}) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-xl border border-border p-5">
      <p className="mb-4 font-heading text-sm font-semibold text-foreground">
        Tulisan Lain dari {author.name}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article, index) => (
          <Reveal key={article.slug} delay={Math.min(index * 60, 240)}>
          <Link
            href={`/artikel/${article.slug}`}
            className="group flex gap-3"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={article.thumbnailUrl}
                alt={article.title}
                fill
                sizes="64px"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center gap-1">
              {article.category && (
                <span className="text-[11px] font-medium text-primary">
                  {article.category.name}
                </span>
              )}
              <span className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-primary">
                {article.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(article.publishedAt)}
              </span>
            </div>
          </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
