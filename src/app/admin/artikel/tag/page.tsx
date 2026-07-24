import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { TagManager } from "@/components/admin/tag-manager";
import { getAllTags } from "@/db/queries/tags";
import { db } from "@/db";
import { articles } from "@/db/schema";

export const metadata: Metadata = {
  title: "Kelola Tag",
  robots: { index: false, follow: false },
};

export default async function AdminTagPage() {
  const [tags, articleRows] = await Promise.all([
    getAllTags(),
    db.select({ tags: articles.tags }).from(articles),
  ]);

  const usageCounts = new Map<string, number>();
  for (const row of articleRows) {
    for (const tagName of row.tags) {
      usageCounts.set(tagName, (usageCounts.get(tagName) ?? 0) + 1);
    }
  }

  const initialTags = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    usageCount: usageCounts.get(tag.name) ?? 0,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/admin/artikel"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar artikel
      </Link>

      <TagManager initialTags={initialTags} />
    </div>
  );
}
