import { eq } from "drizzle-orm";

import { db } from "@/db";
import { pages } from "@/db/schema";
import { sanitizeArticleContent } from "@/lib/sanitize-html";

export async function getPageBySlug(slug: string) {
  return db.query.pages.findFirst({
    where: eq(pages.slug, slug),
  });
}

export async function getAllPages() {
  return db.query.pages.findMany();
}

export async function updatePageContent(
  slug: string,
  data: { title?: string; content?: string }
) {
  const [updated] = await db
    .update(pages)
    .set({
      ...data,
      content:
        data.content !== undefined
          ? sanitizeArticleContent(data.content)
          : undefined,
      updatedAt: new Date(),
    })
    .where(eq(pages.slug, slug))
    .returning();

  return updated;
}
