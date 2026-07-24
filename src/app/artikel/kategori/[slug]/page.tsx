import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categories as categoriesTable } from "@/db/schema";
import { getAllCategories } from "@/db/queries/categories";
import { getPaginatedArticles } from "@/lib/data/articles";
import { ArticlesFilterView } from "@/components/artikel/articles-filter-view";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({
    where: eq(categoriesTable.slug, slug),
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Kategori Tidak Ditemukan" };
  }

  return {
    title: `Artikel ${category.name}`,
    description: category.description,
  };
}

export default async function CategoryArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [result, allCategories] = await Promise.all([
    getPaginatedArticles({ categorySlug: category.slug, page: Number(page) || 1 }),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Artikel {category.name}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {category.description} &middot; {result.totalCount} artikel
          </p>

          <ArticlesFilterView
            initialArticles={result.items}
            initialCategorySlug={category.slug}
            initialPage={result.page}
            initialTotalPages={result.totalPages}
            categories={allCategories}
          />
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
