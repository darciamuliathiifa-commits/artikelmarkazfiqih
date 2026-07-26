import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { tags } from "@/db/schema";

export async function getAllTags() {
  return db.query.tags.findMany({ orderBy: asc(tags.name) });
}

export async function createTag(name: string) {
  const [created] = await db.insert(tags).values({ name }).returning();
  return created;
}

export async function updateTag(id: string, name: string) {
  const [updated] = await db
    .update(tags)
    .set({ name })
    .where(eq(tags.id, id))
    .returning();

  return updated;
}

export async function deleteTag(id: string) {
  const [deleted] = await db.delete(tags).where(eq(tags.id, id)).returning();
  return deleted;
}
