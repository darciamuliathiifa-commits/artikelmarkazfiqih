import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { db } from "@/db";
import { ArticleEditorForm } from "@/components/admin/article-editor-form";

export const metadata: Metadata = {
  title: "Tulis Artikel Baru",
  robots: { index: false, follow: false },
};

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    db.query.categories.findMany(),
    db.query.users.findMany({ where: (users, { eq }) => eq(users.role, "kontributor") }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/admin/artikel"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar artikel
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Tulis Artikel Baru
      </h1>

      <ArticleEditorForm categories={categories} authors={authors} />
    </div>
  );
}
