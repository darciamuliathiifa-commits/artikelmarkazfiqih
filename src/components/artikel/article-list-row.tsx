import Link from "next/link";
import Image from "next/image";

import type { ArticleListItem } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

export function ArticleListRow({ article }: { article: ArticleListItem }) {
  const { author, category } = article;

  return (
    <Reveal className="border-b border-border py-6 first:pt-0 last:border-b-0">
    <article className="flex items-start justify-between gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {author && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={20}
              height={20}
              className="size-5 rounded-full object-cover"
            />
            <Link
              href={`/kontributor/${author.slug}`}
              className="font-medium text-foreground hover:text-primary"
            >
              {author.name}
            </Link>
            <span aria-hidden="true">·</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        )}

        <Link href={`/artikel/${article.slug}`} className="group">
          <h2 className="font-reading text-lg font-bold leading-snug text-foreground group-hover:text-primary sm:text-xl">
            {article.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 font-reading text-sm leading-relaxed text-muted-foreground sm:text-base">
            {article.excerpt}
          </p>
        </Link>

        {category && (
          <Link
            href={`/artikel/kategori/${category.slug}`}
            className="mt-1 w-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            {category.name}
          </Link>
        )}
      </div>

      <Link
        href={`/artikel/${article.slug}`}
        className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-muted sm:w-28 md:w-32"
      >
        <Image
          src={article.thumbnailUrl}
          alt={article.title}
          fill
          sizes="(min-width: 640px) 128px, 80px"
          className="object-cover"
        />
      </Link>
    </article>
    </Reveal>
  );
}
