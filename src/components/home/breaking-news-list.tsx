import Link from "next/link";
import Image from "next/image";

import type { ArticleListItem } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

export function BreakingNewsList({ articles }: { articles: ArticleListItem[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {articles.map((article, index) => (
        <Reveal key={article.slug} delay={Math.min(index * 60, 300)}>
        <article
          className="group flex gap-4 rounded-2xl border border-border p-3 transition-colors hover:border-primary/40"
        >
          <Link
            href={`/artikel/${article.slug}`}
            className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-36"
          >
            <Image
              src={article.thumbnailUrl}
              alt={article.title}
              fill
              sizes="(min-width: 640px) 144px, 112px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
            {article.category && (
              <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {article.category.name}
              </span>
            )}
            <Link href={`/artikel/${article.slug}`}>
              <h3 className="line-clamp-2 font-heading text-base font-bold leading-snug text-foreground group-hover:text-primary sm:text-lg">
                {article.title}
              </h3>
            </Link>
            <p className="line-clamp-2 hidden text-sm text-muted-foreground sm:block">
              {article.excerpt}
            </p>
            <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
              {article.author && (
                <span className="font-medium text-foreground">
                  {article.author.name}
                </span>
              )}
              <span>&middot;</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </article>
        </Reveal>
      ))}
    </div>
  );
}
