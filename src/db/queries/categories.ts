import { count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { articles, categories } from "@/db/schema";

export async function getAllCategories() {
  return db.query.categories.findMany({
    orderBy: (categories, { asc }) => asc(categories.name),
  });
}

export async function getCategoriesWithArticleCount() {
  const allCategories = await getAllCategories();

  const counts = await db
    .select({ categoryId: articles.categoryId, total: count() })
    .from(articles)
    .where(eq(articles.isPublished, true))
    .groupBy(articles.categoryId);
  const countByCategoryId = new Map(counts.map((c) => [c.categoryId, c.total]));

  const latestArticles = await db.query.articles.findMany({
    where: eq(articles.isPublished, true),
    orderBy: desc(articles.publishedAt),
    columns: { categoryId: true, thumbnailUrl: true },
  });
  const thumbnailByCategoryId = new Map<string, string | null>();
  for (const article of latestArticles) {
    if (!thumbnailByCategoryId.has(article.categoryId)) {
      thumbnailByCategoryId.set(article.categoryId, article.thumbnailUrl);
    }
  }

  return allCategories.map((category) => ({
    name: category.name,
    slug: category.slug,
    articleCount: countByCategoryId.get(category.id) ?? 0,
    thumbnailUrl: thumbnailByCategoryId.get(category.id) || null,
  }));
}
