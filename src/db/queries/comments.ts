import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { articles, comments, qna } from "@/db/schema";

export async function createComment(data: {
  name: string;
  email: string;
  content: string;
  articleId?: string;
  qnaId?: string;
}) {
  const [created] = await db
    .insert(comments)
    .values({
      name: data.name,
      email: data.email,
      content: data.content,
      articleId: data.articleId,
      qnaId: data.qnaId,
    })
    .returning();

  return created;
}

export async function getApprovedCommentsForArticle(articleId: string) {
  return db.query.comments.findMany({
    where: and(eq(comments.articleId, articleId), eq(comments.isApproved, true)),
    orderBy: desc(comments.createdAt),
  });
}

export async function getApprovedCommentsForQna(qnaId: string) {
  return db.query.comments.findMany({
    where: and(eq(comments.qnaId, qnaId), eq(comments.isApproved, true)),
    orderBy: desc(comments.createdAt),
  });
}

export async function getAllCommentsForAdmin() {
  return db.query.comments.findMany({
    orderBy: desc(comments.createdAt),
    with: {
      article: { columns: { title: true, slug: true } },
      qna: { columns: { title: true, slug: true } },
    },
  });
}

export async function setCommentApproval(id: string, isApproved: boolean) {
  const [updated] = await db
    .update(comments)
    .set({ isApproved })
    .where(eq(comments.id, id))
    .returning();

  return updated;
}

export async function deleteComment(id: string) {
  const [deleted] = await db.delete(comments).where(eq(comments.id, id)).returning();
  return deleted;
}

export async function findArticleIdBySlug(slug: string) {
  const row = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
    columns: { id: true },
  });
  return row?.id;
}

export async function findQnaIdBySlug(slug: string) {
  const row = await db.query.qna.findFirst({
    where: eq(qna.slug, slug),
    columns: { id: true },
  });
  return row?.id;
}

export async function getApprovedCommentsByArticleSlug(slug: string) {
  const articleId = await findArticleIdBySlug(slug);
  if (!articleId) return [];
  return getApprovedCommentsForArticle(articleId);
}

export async function getApprovedCommentsByQnaSlug(slug: string) {
  const qnaId = await findQnaIdBySlug(slug);
  if (!qnaId) return [];
  return getApprovedCommentsForQna(qnaId);
}
