"use client";

import { useState } from "react";

import type { ArticleListItem } from "@/lib/data/articles";
import { ArticleCard } from "@/components/home/article-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const PAGE_SIZE = 2;

export function AuthorArticlesList({ articles }: { articles: ArticleListItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {visibleArticles.map((article, index) => (
          <Reveal key={article.slug} delay={Math.min(index * 60, 240)}>
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </div>

      {hasMore && (
        <Button
          variant="outline"
          className="mx-auto"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Muat Lebih Banyak
        </Button>
      )}
    </div>
  );
}
