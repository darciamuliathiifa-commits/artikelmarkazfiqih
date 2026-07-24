import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { db } from "@/db";
import { getAllQnaTopics } from "@/db/queries/qna-topics";
import { QnaEditorForm } from "@/components/admin/qna-editor-form";

export const metadata: Metadata = {
  title: "Tambah Tanya Jawab",
  robots: { index: false, follow: false },
};

export default async function NewQnaPage() {
  const [authors, topics] = await Promise.all([
    db.query.users.findMany({
      where: (users, { eq }) => eq(users.role, "kontributor"),
    }),
    getAllQnaTopics(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/admin/tanya-jawab"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar tanya jawab
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Tambah Tanya Jawab
      </h1>

      <QnaEditorForm authors={authors} topics={topics} />
    </div>
  );
}
