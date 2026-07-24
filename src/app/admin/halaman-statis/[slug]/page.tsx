import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { getPageBySlug } from "@/db/queries/pages";
import { StaticPageEditorForm } from "@/components/admin/static-page-editor-form";

export function generateMetadata(): Metadata {
  return { title: "Edit Halaman Statis", robots: { index: false, follow: false } };
}

export default async function EditStaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/admin/halaman-statis"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar halaman
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Edit: {page.title}
      </h1>

      <StaticPageEditorForm page={page} />
    </div>
  );
}
