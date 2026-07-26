import { inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { settings } from "@/db/schema";

export async function getSettings(keys: string[]) {
  const rows = await db.query.settings.findMany({
    where: inArray(settings.key, keys),
  });

  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function getAllSettings() {
  const rows = await db.query.settings.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function updateSettings(entries: Record<string, string>) {
  const rows = Object.entries(entries).map(([key, value]) => ({ key, value }));

  await db
    .insert(settings)
    .values(rows)
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: sql`excluded.value` },
    });

  return getSettings(Object.keys(entries));
}
