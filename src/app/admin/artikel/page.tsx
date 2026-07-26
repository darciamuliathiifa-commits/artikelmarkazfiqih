import type { Metadata } from "next";

import { ArticleListTable } from "@/components/admin/article-list-table";
import { getAllArticlesForAdmin } from "@/db/queries/articles";
import { getAllCategories } from "@/db/queries/categories";

export const metadata: Metadata = {
  title: "Kelola Artikel",
  robots: { index: false, follow: false },
};

export default async function AdminArticleListPage() {
  const [articles, categories] = await Promise.all([
    getAllArticlesForAdmin(),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <ArticleListTable initialArticles={articles} categories={categories} />
    </div>
  );
}
