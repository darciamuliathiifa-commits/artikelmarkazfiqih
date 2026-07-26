"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { ArticleSummary } from "@/lib/data/articles";
import { ArticleListRow } from "@/components/artikel/article-list-row";
import { Pagination } from "@/components/ui/pagination";

export function ArticlesFilterView({
  initialArticles,
  initialCategorySlug,
  initialPage = 1,
  initialTotalPages = 1,
  categories,
}: {
  initialArticles: ArticleSummary[];
  initialCategorySlug?: string;
  initialPage?: number;
  initialTotalPages?: number;
  categories: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState(initialCategorySlug);
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();

  const basePath = (slug?: string) =>
    slug ? `/artikel/kategori/${slug}` : "/artikel";

  const load = (slug: string | undefined, nextPage: number) => {
    startTransition(async () => {
      const params = new URLSearchParams();
      if (slug) params.set("category", slug);
      if (nextPage > 1) params.set("page", String(nextPage));
      const query = params.toString();

      const response = await fetch(`/api/articles${query ? `?${query}` : ""}`);
      const data: {
        articles: ArticleSummary[];
        pagination: { page: number; totalPages: number };
      } = await response.json();
      setArticles(data.articles);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    });

    const urlParams = new URLSearchParams();
    if (nextPage > 1) urlParams.set("page", String(nextPage));
    const urlQuery = urlParams.toString();
    router.replace(`${basePath(slug)}${urlQuery ? `?${urlQuery}` : ""}`, {
      scroll: false,
    });
  };

  const handleSelect = (slug?: string) => {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
    load(slug, 1);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) return;
    load(activeSlug, nextPage);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleSelect(undefined)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            !activeSlug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          Semua
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category.slug}
            onClick={() => handleSelect(category.slug)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeSlug === category.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div
        className={`mt-6 flex flex-col transition-opacity ${
          isPending ? "opacity-50" : ""
        }`}
      >
        {articles.map((article) => (
          <ArticleListRow key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          {activeSlug
            ? "Belum ada artikel pada kategori ini."
            : "Belum ada artikel yang dipublikasikan."}
        </p>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
