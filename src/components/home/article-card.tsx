import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ArticleListItem } from "@/lib/data/articles";
import { formatDate, formatViews } from "@/lib/format";

export function ArticleCard({ article }: { article: ArticleListItem }) {
  const { author, category } = article;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/artikel/${article.slug}`}
        className="relative block aspect-16/10 w-full overflow-hidden bg-muted"
      >
        <Image
          src={article.thumbnailUrl}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform group-hover:scale-[1.03]"
        />
        {category && (
          <Badge className="absolute left-2.5 top-2.5 bg-primary text-primary-foreground">
            {category.name}
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
          <Link href={`/artikel/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs text-muted-foreground">
          {author && (
            <Link
              href={`/kontributor/${author.slug}`}
              className="truncate font-medium text-foreground hover:text-primary"
            >
              {author.name}
            </Link>
          )}
          <div className="flex shrink-0 items-center gap-3">
            <span>{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatViews(article.views)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
