import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { kegiatan } from "@/db/schema";
import { slugify } from "@/lib/slugify";
import { sanitizeArticleContent } from "@/lib/sanitize-html";

/**
 * Generates a clean, unique slug for a kegiatan URL (/kegiatan/[slug]),
 * appending -2, -3, etc. on collision.
 */
export async function generateUniqueKegiatanSlug(
  title: string,
  excludeKegiatanId?: string
): Promise<string> {
  const base = slugify(title) || "kegiatan";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.query.kegiatan.findFirst({
      where: eq(kegiatan.slug, candidate),
    });
    if (!existing || existing.id === excludeKegiatanId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createKegiatan(data: {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  thumbnailUrl?: string;
  eventDate?: Date | null;
  isPublished?: boolean;
  isFeatured?: boolean;
}) {
  const slug = await generateUniqueKegiatanSlug(data.slug || data.title);

  const [created] = await db
    .insert(kegiatan)
    .values({
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: sanitizeArticleContent(data.content),
      thumbnailUrl: data.thumbnailUrl,
      eventDate: data.eventDate ?? null,
      isPublished: data.isPublished ?? false,
      isFeatured: data.isFeatured ?? false,
    })
    .returning();

  return created;
}

export async function updateKegiatan(
  slug: string,
  data: Partial<{
    title: string;
    excerpt: string;
    content: string;
    thumbnailUrl: string | null;
    eventDate: Date | null;
    isPublished: boolean;
    isFeatured: boolean;
  }>
) {
  const existing = await db.query.kegiatan.findFirst({
    where: eq(kegiatan.slug, slug),
  });
  if (!existing) return null;

  const [updated] = await db
    .update(kegiatan)
    .set({
      ...data,
      content:
        data.content !== undefined
          ? sanitizeArticleContent(data.content)
          : undefined,
      updatedAt: new Date(),
    })
    .where(eq(kegiatan.slug, slug))
    .returning();

  return updated;
}

export async function deleteKegiatan(slug: string) {
  const [deleted] = await db
    .delete(kegiatan)
    .where(eq(kegiatan.slug, slug))
    .returning();

  return deleted;
}

export async function searchKegiatanDb(query: string, limit = 5) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const pattern = `%${trimmed}%`;
  return db.query.kegiatan.findMany({
    where: and(
      eq(kegiatan.isPublished, true),
      or(ilike(kegiatan.title, pattern), ilike(kegiatan.excerpt, pattern))
    ),
    orderBy: desc(kegiatan.eventDate),
    limit,
  });
}

export async function getKegiatanBySlug(slug: string) {
  return db.query.kegiatan.findFirst({ where: eq(kegiatan.slug, slug) });
}

export async function getPublishedKegiatanBySlug(slug: string) {
  return db.query.kegiatan.findFirst({
    where: and(eq(kegiatan.slug, slug), eq(kegiatan.isPublished, true)),
  });
}

export async function getAllKegiatanForAdmin() {
  return db.query.kegiatan.findMany({ orderBy: desc(kegiatan.createdAt) });
}

export async function getPublishedKegiatan(limit?: number) {
  return db.query.kegiatan.findMany({
    where: eq(kegiatan.isPublished, true),
    orderBy: desc(kegiatan.eventDate),
    limit,
  });
}

export async function getFeaturedKegiatan(limit = 3) {
  const featured = await db.query.kegiatan.findMany({
    where: and(eq(kegiatan.isPublished, true), eq(kegiatan.isFeatured, true)),
    orderBy: desc(kegiatan.eventDate),
    limit,
  });

  if (featured.length > 0) return featured;

  return db.query.kegiatan.findMany({
    where: eq(kegiatan.isPublished, true),
    orderBy: desc(kegiatan.eventDate),
    limit,
  });
}

export async function getPublishedKegiatanForSitemap() {
  return db
    .select({
      slug: kegiatan.slug,
      updatedAt: kegiatan.updatedAt,
    })
    .from(kegiatan)
    .where(eq(kegiatan.isPublished, true));
}

export async function countPublishedKegiatan() {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(kegiatan)
    .where(eq(kegiatan.isPublished, true));
  return rows[0]?.count ?? 0;
}
