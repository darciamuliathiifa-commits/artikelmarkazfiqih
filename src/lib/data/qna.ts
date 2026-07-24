import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { qna, qnaTopics } from "@/db/schema";
import {
  getPaginatedPublishedQna,
  getQnaBySlug,
  searchQnaDb,
} from "@/db/queries/qna";
import { FALLBACK_AVATAR } from "@/lib/data/articles";

export type QnaListItem = {
  slug: string;
  title: string;
  question: string;
  answer: string;
  createdAt: string;
  answeredBy: { name: string; slug: string } | null;
  topic: { name: string; slug: string } | null;
};

export type QnaDetail = QnaListItem & {
  answeredByProfile: {
    slug: string;
    name: string;
    avatarUrl: string;
    bio: string;
    longBio: string;
    websiteUrl: string;
    facebookUrl: string;
  } | null;
};

export type PaginatedQna = {
  items: QnaListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

type QnaRow = Awaited<ReturnType<typeof getPaginatedPublishedQna>>["items"][number];

function toQnaListItem(row: QnaRow): QnaListItem {
  return {
    slug: row.slug,
    title: row.title,
    question: row.question,
    answer: row.answer,
    createdAt: row.createdAt.toISOString(),
    answeredBy: row.answeredBy
      ? { name: row.answeredBy.name, slug: row.answeredBy.slug }
      : null,
    topic: row.topic ? { name: row.topic.name, slug: row.topic.slug } : null,
  };
}

export async function getPaginatedQna({
  topicSlug,
  page = 1,
  pageSize,
}: {
  topicSlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedQna> {
  const result = await getPaginatedPublishedQna({ topicSlug, page, pageSize });
  return { ...result, items: result.items.map(toQnaListItem) };
}

export async function getQnaDetail(slug: string): Promise<QnaDetail | undefined> {
  const row = await getQnaBySlug(slug);
  if (!row || !row.isPublished) return undefined;

  return {
    ...toQnaListItem(row),
    answeredByProfile: row.answeredBy
      ? {
          slug: row.answeredBy.slug,
          name: row.answeredBy.name,
          avatarUrl: row.answeredBy.avatarUrl || FALLBACK_AVATAR,
          bio: row.answeredBy.bio ?? "",
          longBio: row.answeredBy.longBio ?? "",
          websiteUrl: row.answeredBy.websiteUrl ?? "",
          facebookUrl: row.answeredBy.facebookUrl ?? "",
        }
      : null,
  };
}

export async function searchQna(query: string): Promise<QnaListItem[]> {
  const rows = await searchQnaDb(query);
  return rows.map(toQnaListItem);
}

export async function getRelatedQna(
  topicSlug: string | null,
  excludeSlug: string,
  limit = 3
): Promise<QnaListItem[]> {
  let rows: QnaRow[] = [];

  if (topicSlug) {
    const topic = await db.query.qnaTopics.findFirst({
      where: eq(qnaTopics.slug, topicSlug),
    });
    if (topic) {
      rows = await db.query.qna.findMany({
        where: and(
          eq(qna.isPublished, true),
          eq(qna.topicId, topic.id),
          ne(qna.slug, excludeSlug)
        ),
        orderBy: desc(qna.createdAt),
        with: { answeredBy: true, topic: true },
        limit,
      });
    }
  }

  if (rows.length < limit) {
    const existingIds = new Set(rows.map((row) => row.id));
    const fallback = await db.query.qna.findMany({
      where: and(eq(qna.isPublished, true), ne(qna.slug, excludeSlug)),
      orderBy: desc(qna.createdAt),
      with: { answeredBy: true, topic: true },
      limit: limit + rows.length,
    });
    for (const row of fallback) {
      if (rows.length >= limit) break;
      if (!existingIds.has(row.id)) rows.push(row);
    }
  }

  return rows.map(toQnaListItem);
}
