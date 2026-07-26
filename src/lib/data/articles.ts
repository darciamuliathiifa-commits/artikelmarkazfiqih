import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { articles, categories, users } from "@/db/schema";
import {
  getFeaturedArticles as getFeaturedArticlesDb,
  getPaginatedPublishedArticles,
  searchArticlesDb,
} from "@/db/queries/articles";

export const FALLBACK_THUMBNAIL = "/images/banner-pattern.webp";
export const FALLBACK_AVATAR = "/images/avatar-placeholder-red.png";

export type ArticleListItem = {
  slug: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  publishedAt: string;
  views: number;
  category: { name: string; slug: string } | null;
  author: { name: string; slug: string; avatarUrl: string } | null;
};

/** Backward-compatible alias — the list shape used by filter views and cards. */
export type ArticleSummary = ArticleListItem;

export type ArticleDetail = ArticleListItem & {
  content: string;
  tags: string[];
  metaDescription: string;
  authorProfile: {
    slug: string;
    name: string;
    avatarUrl: string;
    bio: string;
    longBio: string;
    websiteUrl: string;
    facebookUrl: string;
  } | null;
};

type ArticleRow = typeof articles.$inferSelect & {
  category?: typeof categories.$inferSelect | null;
  author?: typeof users.$inferSelect | null;
};

export function toArticleListItem(row: ArticleRow): ArticleListItem {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    thumbnailUrl: row.thumbnailUrl || FALLBACK_THUMBNAIL,
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    views: row.views,
    category: row.category
      ? { name: row.category.name, slug: row.category.slug }
      : null,
    author: row.author
      ? {
          name: row.author.name,
          slug: row.author.slug,
          avatarUrl: row.author.avatarUrl || FALLBACK_AVATAR,
        }
      : null,
  };
}

const publishedWithRelations = {
  orderBy: desc(articles.publishedAt),
  with: { author: true, category: true },
} as const;

export type PaginatedArticles = {
  items: ArticleListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export async function getPaginatedArticles({
  categorySlug,
  page = 1,
}: {
  categorySlug?: string;
  page?: number;
}): Promise<PaginatedArticles> {
  const result = await getPaginatedPublishedArticles({ categorySlug, page });
  return { ...result, items: result.items.map(toArticleListItem) };
}

export async function getLatestArticles(limit = 8): Promise<ArticleListItem[]> {
  const rows = await db.query.articles.findMany({
    where: eq(articles.isPublished, true),
    limit,
    ...publishedWithRelations,
  });
  return rows.map(toArticleListItem);
}

export async function getFeaturedArticles(limit = 3): Promise<ArticleListItem[]> {
  const rows = await getFeaturedArticlesDb(limit);
  return rows.map(toArticleListItem);
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleDetail | undefined> {
  const row = await db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.isPublished, true)),
    with: { author: true, category: true },
  });
  if (!row) return undefined;

  return {
    ...toArticleListItem(row),
    content: row.content,
    tags: row.tags,
    metaDescription: row.metaDescription || row.excerpt,
    authorProfile: row.author
      ? {
          slug: row.author.slug,
          name: row.author.name,
          avatarUrl: row.author.avatarUrl || FALLBACK_AVATAR,
          bio: row.author.bio ?? "",
          longBio: row.author.longBio ?? "",
          websiteUrl: row.author.websiteUrl ?? "",
          facebookUrl: row.author.facebookUrl ?? "",
        }
      : null,
  };
}

export async function getOtherArticlesByAuthor(
  authorSlug: string,
  excludeSlug: string,
  limit = 4
): Promise<ArticleListItem[]> {
  const author = await db.query.users.findFirst({
    where: eq(users.slug, authorSlug),
  });
  if (!author) return [];

  const rows = await db.query.articles.findMany({
    where: and(
      eq(articles.isPublished, true),
      eq(articles.authorId, author.id),
      ne(articles.slug, excludeSlug)
    ),
    limit,
    ...publishedWithRelations,
  });
  return rows.map(toArticleListItem);
}

export async function searchArticles(query: string): Promise<ArticleListItem[]> {
  const rows = await searchArticlesDb(query);
  return rows.map(toArticleListItem);
}

export async function getRelatedArticles(
  categorySlug: string | null,
  excludeSlug: string,
  limit = 3
): Promise<ArticleListItem[]> {
  let rows: ArticleRow[] = [];

  if (categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    if (category) {
      rows = await db.query.articles.findMany({
        where: and(
          eq(articles.isPublished, true),
          eq(articles.categoryId, category.id),
          ne(articles.slug, excludeSlug)
        ),
        limit,
        ...publishedWithRelations,
      });
    }
  }

  if (rows.length < limit) {
    const existingIds = new Set(rows.map((row) => row.id));
    const fallback = await db.query.articles.findMany({
      where: and(eq(articles.isPublished, true), ne(articles.slug, excludeSlug)),
      limit: limit + rows.length,
      ...publishedWithRelations,
    });
    for (const row of fallback) {
      if (rows.length >= limit) break;
      if (!existingIds.has(row.id)) rows.push(row);
    }
  }

  return rows.map(toArticleListItem);
}
