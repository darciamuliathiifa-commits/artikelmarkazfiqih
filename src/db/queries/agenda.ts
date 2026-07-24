import { and, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/db";
import { agenda } from "@/db/schema";

export async function getAllAgendaForAdmin() {
  return db.query.agenda.findMany({ orderBy: desc(agenda.createdAt) });
}

export async function getPublishedAgenda() {
  return db.query.agenda.findMany({
    where: eq(agenda.isPublished, true),
    orderBy: desc(agenda.createdAt),
  });
}

export async function getLatestAgenda(limit = 3) {
  return db.query.agenda.findMany({
    where: eq(agenda.isPublished, true),
    orderBy: desc(agenda.createdAt),
    limit,
  });
}

export async function searchAgendaDb(query: string, limit = 5) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const pattern = `%${trimmed}%`;
  return db.query.agenda.findMany({
    where: and(
      eq(agenda.isPublished, true),
      or(
        ilike(agenda.title, pattern),
        ilike(agenda.scheduleText, pattern),
        ilike(agenda.description, pattern)
      )
    ),
    orderBy: desc(agenda.createdAt),
    limit,
  });
}

export async function getAgendaById(id: string) {
  return db.query.agenda.findFirst({ where: eq(agenda.id, id) });
}

export async function getPublishedAgendaById(id: string) {
  return db.query.agenda.findFirst({
    where: and(eq(agenda.id, id), eq(agenda.isPublished, true)),
  });
}

export async function createAgenda(data: {
  title: string;
  type: "rutin" | "khusus";
  scheduleText: string;
  description?: string | null;
  pengajar?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  isPublished: boolean;
}) {
  const [created] = await db.insert(agenda).values(data).returning();
  return created;
}

export async function updateAgenda(
  id: string,
  data: Partial<{
    title: string;
    type: "rutin" | "khusus";
    scheduleText: string;
    description: string | null;
    pengajar: string | null;
    imageUrl: string | null;
    linkUrl: string | null;
    isPublished: boolean;
  }>
) {
  const [updated] = await db
    .update(agenda)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(agenda.id, id))
    .returning();

  return updated;
}

export async function deleteAgenda(id: string) {
  const [deleted] = await db.delete(agenda).where(eq(agenda.id, id)).returning();
  return deleted;
}
