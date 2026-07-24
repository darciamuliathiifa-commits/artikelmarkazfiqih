import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { getKegiatanBySlug } from "@/db/queries/kegiatan";
import { KegiatanEditorForm } from "@/components/admin/kegiatan-editor-form";

export function generateMetadata(): Metadata {
  return { title: "Edit Kegiatan", robots: { index: false, follow: false } };
}

export default async function EditKegiatanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getKegiatanBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/admin/kegiatan"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar kegiatan
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Edit: {item.title}
      </h1>

      <KegiatanEditorForm
        submitLabel="Simpan Perubahan"
        initialValues={{
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          thumbnailUrl: item.thumbnailUrl ?? "",
          eventDate: item.eventDate ? item.eventDate.toISOString().slice(0, 10) : "",
          isPublished: item.isPublished,
          isFeatured: item.isFeatured,
        }}
      />
    </div>
  );
}
