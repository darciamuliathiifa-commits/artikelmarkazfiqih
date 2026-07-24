import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { qnaTopics } from "@/db/schema";
import { slugify } from "@/lib/slugify";

/**
 * Generates a clean, unique slug for a QnA topic (/tanya-jawab/topik/[slug]),
 * appending -2, -3, etc. on collision.
 */
export async function generateUniqueQnaTopicSlug(
  name: string,
  excludeTopicId?: string
): Promise<string> {
  const base = slugify(name) || "topik";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.query.qnaTopics.findFirst({
      where: eq(qnaTopics.slug, candidate),
    });
    if (!existing || existing.id === excludeTopicId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function getAllQnaTopics() {
  return db.query.qnaTopics.findMany({ orderBy: asc(qnaTopics.name) });
}

export async function getQnaTopicBySlug(slug: string) {
  return db.query.qnaTopics.findFirst({ where: eq(qnaTopics.slug, slug) });
}

export async function createQnaTopic(name: string) {
  const slug = await generateUniqueQnaTopicSlug(name);
  const [created] = await db.insert(qnaTopics).values({ name, slug }).returning();
  return created;
}

export async function updateQnaTopic(id: string, name: string) {
  const slug = await generateUniqueQnaTopicSlug(name, id);
  const [updated] = await db
    .update(qnaTopics)
    .set({ name, slug })
    .where(eq(qnaTopics.id, id))
    .returning();

  return updated;
}

export async function deleteQnaTopic(id: string) {
  const [deleted] = await db
    .delete(qnaTopics)
    .where(eq(qnaTopics.id, id))
    .returning();

  return deleted;
}
