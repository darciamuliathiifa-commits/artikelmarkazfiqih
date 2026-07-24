import type { Metadata } from "next";

import { getPaginatedArticles } from "@/lib/data/articles";
import { getAllCategories } from "@/db/queries/categories";
import { ArticlesFilterView } from "@/components/artikel/articles-filter-view";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export const metadata: Metadata = {
  title: "Artikel",
  description:
    "Kumpulan artikel Fiqih, Ushul Fiqih, Kaidah Fiqih, Doa, Kisah, dan Umum dari Markaz Fiqih.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const [result, categories] = await Promise.all([
    getPaginatedArticles({ page: Number(page) || 1 }),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Semua Artikel
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {result.totalCount} artikel dipublikasikan
          </p>

          <ArticlesFilterView
            initialArticles={result.items}
            initialPage={result.page}
            initialTotalPages={result.totalPages}
            categories={categories}
          />
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
