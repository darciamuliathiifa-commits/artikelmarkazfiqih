import { and, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/db";
import { ebooks } from "@/db/schema";
import { slugify } from "@/lib/slugify";

/**
 * Generates a clean, unique slug for an e-book (/e-book/[slug]),
 * appending -2, -3, etc. on collision.
 */
export async function generateUniqueEbookSlug(
  title: string,
  excludeEbookId?: string
): Promise<string> {
  const base = slugify(title) || "ebook";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.query.ebooks.findFirst({
      where: eq(ebooks.slug, candidate),
    });
    if (!existing || existing.id === excludeEbookId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createEbook(data: {
  title: string;
  slug?: string;
  description: string;
  coverImageUrl?: string | null;
  previewImages?: string[];
  purchaseUrl?: string | null;
  isPublished?: boolean;
}) {
  const slug = await generateUniqueEbookSlug(data.slug || data.title);

  const [created] = await db
    .insert(ebooks)
    .values({
      title: data.title,
      slug,
      description: data.description,
      coverImageUrl: data.coverImageUrl ?? null,
      previewImages: data.previewImages ?? [],
      purchaseUrl: data.purchaseUrl ?? null,
      isPublished: data.isPublished ?? false,
    })
    .returning();

  return created;
}

export async function updateEbook(
  slug: string,
  data: Partial<{
    title: string;
    description: string;
    coverImageUrl: string | null;
    previewImages: string[];
    purchaseUrl: string | null;
    isPublished: boolean;
  }>
) {
  const [updated] = await db
    .update(ebooks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(ebooks.slug, slug))
    .returning();

  return updated;
}

export async function deleteEbook(slug: string) {
  const [deleted] = await db.delete(ebooks).where(eq(ebooks.slug, slug)).returning();
  return deleted;
}

export async function getEbookBySlug(slug: string) {
  return db.query.ebooks.findFirst({ where: eq(ebooks.slug, slug) });
}

export async function getPublishedEbookBySlug(slug: string) {
  return db.query.ebooks.findFirst({
    where: and(eq(ebooks.slug, slug), eq(ebooks.isPublished, true)),
  });
}

export async function getAllEbooksForAdmin() {
  return db.query.ebooks.findMany({ orderBy: desc(ebooks.createdAt) });
}

export async function getPublishedEbooks() {
  return db.query.ebooks.findMany({
    where: eq(ebooks.isPublished, true),
    orderBy: desc(ebooks.createdAt),
  });
}

export async function searchEbooksDb(query: string, limit = 5) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const pattern = `%${trimmed}%`;
  return db.query.ebooks.findMany({
    where: and(
      eq(ebooks.isPublished, true),
      or(ilike(ebooks.title, pattern), ilike(ebooks.description, pattern))
    ),
    orderBy: desc(ebooks.createdAt),
    limit,
  });
}

export async function getPublishedEbooksForSitemap() {
  return db
    .select({ slug: ebooks.slug, updatedAt: ebooks.updatedAt })
    .from(ebooks)
    .where(eq(ebooks.isPublished, true));
}
