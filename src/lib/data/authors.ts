import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { getAllContributors } from "@/db/queries/authors";
import {
  FALLBACK_AVATAR,
  toArticleListItem,
  type ArticleListItem,
} from "@/lib/data/articles";

export type AuthorProfile = {
  slug: string;
  name: string;
  avatarUrl: string;
  bio: string;
  longBio: string;
  websiteUrl: string;
  facebookUrl: string;
};

type UserRow = typeof users.$inferSelect;

function toAuthorProfile(row: UserRow): AuthorProfile {
  return {
    slug: row.slug,
    name: row.name,
    avatarUrl: row.avatarUrl || FALLBACK_AVATAR,
    bio: row.bio ?? "",
    longBio: row.longBio ?? "",
    websiteUrl: row.websiteUrl ?? "",
    facebookUrl: row.facebookUrl ?? "",
  };
}

export async function getAuthorBySlug(
  slug: string
): Promise<AuthorProfile | undefined> {
  const row = await db.query.users.findFirst({
    where: and(eq(users.slug, slug), eq(users.role, "kontributor")),
  });
  return row ? toAuthorProfile(row) : undefined;
}

export async function getArticlesByAuthor(
  authorSlug: string
): Promise<ArticleListItem[]> {
  const author = await db.query.users.findFirst({
    where: eq(users.slug, authorSlug),
  });
  if (!author) return [];

  const rows = await db.query.articles.findMany({
    where: and(
      eq(articles.isPublished, true),
      eq(articles.authorId, author.id)
    ),
    orderBy: desc(articles.publishedAt),
    with: { author: true, category: true },
  });
  return rows.map(toArticleListItem);
}

export async function getContributorsWithCount(): Promise<
  (AuthorProfile & { articleCount: number })[]
> {
  const rows = await getAllContributors();
  return rows
    .map((row) => ({
      ...toAuthorProfile(row),
      articleCount: row.articleCount,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
