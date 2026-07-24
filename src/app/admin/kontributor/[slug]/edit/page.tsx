import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { getAuthorBySlugWithArticles } from "@/db/queries/authors";
import { ContributorEditorForm } from "@/components/admin/contributor-editor-form";

export function generateMetadata(): Metadata {
  return { title: "Edit Kontributor", robots: { index: false, follow: false } };
}

export default async function EditContributorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contributor = await getAuthorBySlugWithArticles(slug);

  if (!contributor) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/admin/kontributor"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar kontributor
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Edit: {contributor.name}
      </h1>

      <ContributorEditorForm
        initialValues={{
          slug: contributor.slug,
          name: contributor.name,
          bio: contributor.bio ?? "",
          longBio: contributor.longBio ?? "",
          avatarUrl: contributor.avatarUrl ?? "",
          websiteUrl: contributor.websiteUrl ?? "",
          facebookUrl: contributor.facebookUrl ?? "",
        }}
      />
    </div>
  );
}
