import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { qna, qnaTopics } from "@/db/schema";
import { slugify } from "@/lib/slugify";
import { sanitizeArticleContent } from "@/lib/sanitize-html";

/**
 * Generates a clean, unique slug for a Q&A URL (/tanya-jawab/[slug]),
 * appending -2, -3, etc. on collision.
 */
export async function generateUniqueQnaSlug(
  title: string,
  excludeQnaId?: string
): Promise<string> {
  const base = slugify(title) || "tanya-jawab";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.query.qna.findFirst({
      where: eq(qna.slug, candidate),
    });
    if (!existing || existing.id === excludeQnaId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createQna(data: {
  title: string;
  slug?: string;
  question: string;
  answer: string;
  answeredById: string;
  topicId?: string | null;
  isPublished?: boolean;
}) {
  const slug = await generateUniqueQnaSlug(data.slug || data.title);

  const [created] = await db
    .insert(qna)
    .values({
      title: data.title,
      slug,
      question: data.question,
      answer: sanitizeArticleContent(data.answer),
      answeredById: data.answeredById,
      topicId: data.topicId ?? null,
      isPublished: data.isPublished ?? false,
    })
    .returning();

  return created;
}

export async function updateQna(
  slug: string,
  data: {
    title?: string;
    question?: string;
    answer?: string;
    answeredById?: string;
    topicId?: string | null;
    isPublished?: boolean;
  }
) {
  const [updated] = await db
    .update(qna)
    .set({
      ...data,
      answer: data.answer !== undefined ? sanitizeArticleContent(data.answer) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(qna.slug, slug))
    .returning();

  return updated;
}

export async function deleteQna(slug: string) {
  const [deleted] = await db.delete(qna).where(eq(qna.slug, slug)).returning();
  return deleted;
}

export async function getQnaBySlug(slug: string) {
  return db.query.qna.findFirst({
    where: eq(qna.slug, slug),
    with: {
      answeredBy: true,
      topic: true,
    },
  });
}

export async function getAllQnaForAdmin() {
  return db.query.qna.findMany({
    orderBy: desc(qna.createdAt),
    with: {
      answeredBy: true,
      topic: true,
    },
  });
}

export async function getPaginatedPublishedQna({
  topicSlug,
  page = 1,
  pageSize = 6,
}: {
  topicSlug?: string;
  page?: number;
  pageSize?: number;
}) {
  let topicId: string | undefined;

  if (topicSlug) {
    const topic = await db.query.qnaTopics.findFirst({
      where: eq(qnaTopics.slug, topicSlug),
    });
    if (!topic) {
      return { items: [], page: 1, pageSize, totalCount: 0, totalPages: 1 };
    }
    topicId = topic.id;
  }

  const whereClause = topicId
    ? and(eq(qna.isPublished, true), eq(qna.topicId, topicId))
    : eq(qna.isPublished, true);

  const countRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(qna)
    .where(whereClause);

  const totalCount = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(totalPages, Math.max(1, Math.trunc(page) || 1));

  const items = await db.query.qna.findMany({
    where: whereClause,
    orderBy: desc(qna.createdAt),
    with: { answeredBy: true, topic: true },
    limit: pageSize,
    offset: (safePage - 1) * pageSize,
  });

  return { items, page: safePage, pageSize, totalCount, totalPages };
}

export async function searchQnaDb(query: string, limit = 20) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { rows } = await db.execute<{ id: string }>(sql`
    SELECT id FROM qna
    WHERE is_published = true
      AND (${trimmed} <% title OR ${trimmed} <% question OR ${trimmed} <% answer)
    ORDER BY GREATEST(
      word_similarity(${trimmed}, title),
      word_similarity(${trimmed}, question),
      word_similarity(${trimmed}, answer)
    ) DESC
    LIMIT ${limit}
  `);
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const results = await db.query.qna.findMany({
    where: and(eq(qna.isPublished, true), inArray(qna.id, ids)),
    with: { answeredBy: true, topic: true },
  });

  const rank = new Map(ids.map((id, index) => [id, index]));
  return results.sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
}
