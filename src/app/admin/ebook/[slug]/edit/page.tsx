import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { getEbookBySlug } from "@/db/queries/ebooks";
import { EbookEditorForm } from "@/components/admin/ebook-editor-form";

export function generateMetadata(): Metadata {
  return { title: "Edit E-Book", robots: { index: false, follow: false } };
}

export default async function EditEbookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getEbookBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/admin/ebook"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar e-book
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Edit: {item.title}
      </h1>

      <EbookEditorForm
        submitLabel="Simpan Perubahan"
        initialValues={{
          title: item.title,
          slug: item.slug,
          description: item.description,
          coverImageUrl: item.coverImageUrl ?? "",
          previewImages: item.previewImages,
          purchaseUrl: item.purchaseUrl ?? "",
          isPublished: item.isPublished,
        }}
      />
    </div>
  );
}
