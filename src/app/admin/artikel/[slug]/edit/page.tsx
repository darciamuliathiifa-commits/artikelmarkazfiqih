import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { db } from "@/db";
import { getArticleBySlugWithAuthor } from "@/db/queries/articles";
import { ArticleEditorForm } from "@/components/admin/article-editor-form";

export function generateMetadata(): Metadata {
  return { title: "Edit Artikel", robots: { index: false, follow: false } };
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlugWithAuthor(slug);

  if (!article) {
    notFound();
  }

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
        Edit: {article.title}
      </h1>

      <ArticleEditorForm
        categories={categories}
        authors={authors}
        submitLabel="Simpan Perubahan"
        initialValues={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          categoryId: article.categoryId,
          authorId: article.authorId,
          tags: article.tags.join(", "),
          thumbnailUrl: article.thumbnailUrl ?? "",
          isPublished: article.isPublished,
          isFeatured: article.isFeatured,
          metaDescription: article.metaDescription ?? "",
        }}
      />
    </div>
  );
}
