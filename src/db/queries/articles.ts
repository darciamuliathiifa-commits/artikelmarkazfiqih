import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { articles, categories } from "@/db/schema";
import { slugify } from "@/lib/slugify";
import { sanitizeArticleContent } from "@/lib/sanitize-html";

/**
 * Generates a clean, unique slug for an article URL (/artikel/[slug]),
 * appending -2, -3, etc. on collision.
 */
export async function generateUniqueArticleSlug(
  title: string,
  excludeArticleId?: string
): Promise<string> {
  const base = slugify(title) || "artikel";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.query.articles.findFirst({
      where: eq(articles.slug, candidate),
    });
    if (!existing || existing.id === excludeArticleId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createArticle(data: {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorId: string;
  thumbnailUrl?: string;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  metaDescription?: string;
}) {
  const slug = await generateUniqueArticleSlug(data.slug || data.title);

  const [created] = await db
    .insert(articles)
    .values({
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: sanitizeArticleContent(data.content),
      categoryId: data.categoryId,
      authorId: data.authorId,
      thumbnailUrl: data.thumbnailUrl,
      tags: data.tags ?? [],
      isPublished: data.isPublished ?? false,
      isFeatured: data.isFeatured ?? false,
      metaDescription: data.metaDescription,
      publishedAt: data.isPublished ? new Date() : null,
    })
    .returning();

  return created;
}

export async function updateArticle(
  slug: string,
  data: {
    title?: string;
    excerpt?: string;
    content?: string;
    categoryId?: string;
    authorId?: string;
    thumbnailUrl?: string;
    tags?: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
    metaDescription?: string;
  }
) {
  const existing = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
  });
  if (!existing) return null;

  const shouldSetPublishedAt =
    data.isPublished && !existing.isPublished && !existing.publishedAt;

  const [updated] = await db
    .update(articles)
    .set({
      ...data,
      content:
        data.content !== undefined
          ? sanitizeArticleContent(data.content)
          : undefined,
      publishedAt: shouldSetPublishedAt ? new Date() : existing.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(articles.slug, slug))
    .returning();

  return updated;
}

export async function deleteArticle(slug: string) {
  const [deleted] = await db
    .delete(articles)
    .where(eq(articles.slug, slug))
    .returning();

  return deleted;
}

export async function getArticleBySlugWithAuthor(slug: string) {
  return db.query.articles.findFirst({
    where: eq(articles.slug, slug),
    with: {
      author: true,
      category: true,
    },
  });
}

export async function incrementArticleViews(slug: string) {
  const [updated] = await db
    .update(articles)
    .set({ views: sql`${articles.views} + 1` })
    .where(eq(articles.slug, slug))
    .returning({ views: articles.views });

  return updated;
}

export async function searchArticlesDb(query: string, limit = 20) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { rows } = await db.execute<{ id: string }>(sql`
    SELECT id FROM articles
    WHERE is_published = true
      AND (${trimmed} <% title OR ${trimmed} <% excerpt OR ${trimmed} <% content)
    ORDER BY GREATEST(
      word_similarity(${trimmed}, title),
      word_similarity(${trimmed}, excerpt),
      word_similarity(${trimmed}, content)
    ) DESC
    LIMIT ${limit}
  `);
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const results = await db.query.articles.findMany({
    where: and(eq(articles.isPublished, true), inArray(articles.id, ids)),
    with: { category: true, author: true },
  });

  const rank = new Map(ids.map((id, index) => [id, index]));
  return results.sort(
    (a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0)
  );
}

export async function getPaginatedPublishedArticles({
  categorySlug,
  page = 1,
  pageSize = 12,
}: {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
}) {
  let categoryId: string | undefined;

  if (categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    if (!category) {
      return { items: [], page: 1, pageSize, totalCount: 0, totalPages: 1 };
    }
    categoryId = category.id;
  }

  const whereClause = categoryId
    ? and(eq(articles.isPublished, true), eq(articles.categoryId, categoryId))
    : eq(articles.isPublished, true);

  const countRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(articles)
    .where(whereClause);

  const totalCount = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(totalPages, Math.max(1, Math.trunc(page) || 1));

  const items = await db.query.articles.findMany({
    where: whereClause,
    orderBy: desc(articles.publishedAt),
    with: { author: true, category: true },
    limit: pageSize,
    offset: (safePage - 1) * pageSize,
  });

  return { items, page: safePage, pageSize, totalCount, totalPages };
}

export async function getAllArticlesForAdmin() {
  return db.query.articles.findMany({
    orderBy: desc(articles.createdAt),
    with: {
      author: true,
      category: true,
    },
  });
}

export async function getFeaturedArticles(limit = 3) {
  return db.query.articles.findMany({
    where: and(eq(articles.isPublished, true), eq(articles.isFeatured, true)),
    orderBy: desc(articles.publishedAt),
    with: { author: true, category: true },
    limit,
  });
}

export async function getPublishedArticlesForSitemap() {
  return db
    .select({
      slug: articles.slug,
      publishedAt: articles.publishedAt,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .where(eq(articles.isPublished, true));
}
