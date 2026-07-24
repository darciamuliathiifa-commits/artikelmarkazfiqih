import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ArticleListItem } from "@/lib/data/articles";
import { formatDate, formatViews } from "@/lib/format";
import { HighlightText } from "@/components/search/highlight-text";

export function SearchResultItem({
  article,
  query,
}: {
  article: ArticleListItem;
  query: string;
}) {
  const { author, category } = article;

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <Link
        href={`/artikel/${article.slug}`}
        className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-muted sm:block"
      >
        <Image
          src={article.thumbnailUrl}
          alt={article.title}
          fill
          sizes="128px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5">
        {category && (
          <Badge variant="secondary" className="w-fit">
            {category.name}
          </Badge>
        )}
        <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
          <Link href={`/artikel/${article.slug}`} className="hover:text-primary">
            <HighlightText text={article.title} query={query} />
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          <HighlightText text={article.excerpt} query={query} />
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
          {author && (
            <Link
              href={`/kontributor/${author.slug}`}
              className="font-medium text-foreground hover:text-primary"
            >
              {author.name}
            </Link>
          )}
          <span>{formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {formatViews(article.views)}
          </span>
        </div>
      </div>
    </article>
  );
}
