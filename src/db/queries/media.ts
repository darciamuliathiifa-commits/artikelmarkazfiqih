import { desc } from "drizzle-orm";

import { db } from "@/db";
import { media } from "@/db/schema";

export async function createMedia(data: {
  url: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  uploadedById?: string;
}) {
  const [created] = await db.insert(media).values(data).returning();
  return created;
}

export async function getAllMedia() {
  return db.query.media.findMany({
    orderBy: desc(media.createdAt),
  });
}
