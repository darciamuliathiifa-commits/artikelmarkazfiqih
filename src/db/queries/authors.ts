import { and, count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { slugify } from "@/lib/slugify";

/**
 * Generates a clean, unique slug for a contributor URL (/kontributor/[slug]),
 * appending -2, -3, etc. on collision so admin-created profiles never clash.
 */
export async function generateUniqueAuthorSlug(
  name: string,
  excludeUserId?: string
): Promise<string> {
  const base = slugify(name) || "kontributor";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.query.users.findFirst({
      where: eq(users.slug, candidate),
    });
    if (!existing || existing.id === excludeUserId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createContributor(data: {
  name: string;
  bio?: string;
  longBio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  facebookUrl?: string;
}) {
  const slug = await generateUniqueAuthorSlug(data.name);
  const email = `${slug}@markazfiqih.com`;

  const [created] = await db
    .insert(users)
    .values({
      name: data.name,
      email,
      slug,
      role: "kontributor",
      bio: data.bio,
      longBio: data.longBio,
      avatarUrl: data.avatarUrl,
      websiteUrl: data.websiteUrl,
      facebookUrl: data.facebookUrl,
    })
    .returning();

  return created;
}

export async function updateContributor(
  slug: string,
  data: {
    name?: string;
    bio?: string;
    longBio?: string;
    avatarUrl?: string;
    websiteUrl?: string;
    facebookUrl?: string;
  }
) {
  const [updated] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.slug, slug))
    .returning();

  return updated;
}

export async function deleteContributor(slug: string) {
  const [deleted] = await db
    .delete(users)
    .where(eq(users.slug, slug))
    .returning();

  return deleted;
}

export async function getAllContributors(publishedOnly = true) {
  const contributors = await db.query.users.findMany({
    where: eq(users.role, "kontributor"),
  });

  const counts = await db
    .select({ authorId: articles.authorId, total: count() })
    .from(articles)
    .where(publishedOnly ? eq(articles.isPublished, true) : undefined)
    .groupBy(articles.authorId);

  const countByAuthorId = new Map(counts.map((c) => [c.authorId, c.total]));

  return contributors.map((contributor) => ({
    ...contributor,
    articleCount: countByAuthorId.get(contributor.id) ?? 0,
  }));
}

export async function getAuthorBySlugWithArticles(slug: string) {
  return db.query.users.findFirst({
    where: eq(users.slug, slug),
    with: {
      articles: {
        where: eq(articles.isPublished, true),
        orderBy: desc(articles.publishedAt),
        with: {
          category: true,
        },
      },
    },
  });
}

export async function getArticlesByAuthorPaginated(
  authorSlug: string,
  { limit = 6, offset = 0 }: { limit?: number; offset?: number } = {}
) {
  const author = await db.query.users.findFirst({
    where: eq(users.slug, authorSlug),
  });
  if (!author) return null;

  const where = and(
    eq(articles.authorId, author.id),
    eq(articles.isPublished, true)
  );

  const [items, [{ total }]] = await Promise.all([
    db.query.articles.findMany({
      where,
      orderBy: desc(articles.publishedAt),
      limit,
      offset,
      with: { category: true },
    }),
    db.select({ total: count() }).from(articles).where(where),
  ]);

  return { items, total };
}
