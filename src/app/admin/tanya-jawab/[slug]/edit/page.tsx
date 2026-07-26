import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { db } from "@/db";
import { getQnaBySlug } from "@/db/queries/qna";
import { getAllQnaTopics } from "@/db/queries/qna-topics";
import { QnaEditorForm } from "@/components/admin/qna-editor-form";

export function generateMetadata(): Metadata {
  return { title: "Edit Tanya Jawab", robots: { index: false, follow: false } };
}

export default async function EditQnaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getQnaBySlug(slug);

  if (!item) {
    notFound();
  }

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
        Edit: {item.title}
      </h1>

      <QnaEditorForm
        authors={authors}
        topics={topics}
        submitLabel="Simpan Perubahan"
        initialValues={{
          title: item.title,
          slug: item.slug,
          question: item.question,
          answer: item.answer,
          answeredById: item.answeredById,
          topicId: item.topicId ?? "",
          isPublished: item.isPublished,
        }}
      />
    </div>
  );
}
