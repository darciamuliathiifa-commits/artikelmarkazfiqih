import { NextResponse } from "next/server";

import {
  deleteArticle,
  getArticleBySlugWithAuthor,
  updateArticle,
} from "@/db/queries/articles";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { validateArticleFields } from "@/lib/validate-article";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await getArticleBySlugWithAuthor(slug);

  if (!article || !article.isPublished) {
    return NextResponse.json(
      { error: "Artikel tidak ditemukan" },
      { status: 404 }
    );
  }

  const origin = new URL(request.url).origin;
  const articleUrl = `${origin}/artikel/${article.slug}`;
  const metaDescription = article.metaDescription || article.excerpt;
  const publishedAtIso = (article.publishedAt ?? article.createdAt).toISOString();

  return NextResponse.json({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    thumbnailUrl: article.thumbnailUrl,
    tags: article.tags,
    views: article.views,
    publishedAt: article.publishedAt,
    category: {
      id: article.category.id,
      name: article.category.name,
      slug: article.category.slug,
    },
    author: {
      id: article.author.id,
      name: article.author.name,
      slug: article.author.slug,
      bio: article.author.bio,
      avatarUrl: article.author.avatarUrl,
    },
    seo: {
      metaTitle: article.title,
      metaDescription,
      canonicalUrl: articleUrl,
      schema: {
        article: articleSchema({
          title: article.title,
          description: metaDescription,
          url: articleUrl,
          thumbnailUrl: article.thumbnailUrl ?? "",
          authorName: article.author.name,
          publishedAt: publishedAtIso,
        }),
        breadcrumb: breadcrumbSchema([
          { name: "Home", url: origin },
          {
            name: article.category.name,
            url: `${origin}/artikel/kategori/${article.category.slug}`,
          },
          { name: article.title, url: articleUrl },
        ]),
      },
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }

  const validationError = validateArticleFields(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const data: Parameters<typeof updateArticle>[1] = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.excerpt === "string") data.excerpt = body.excerpt;
  if (typeof body.content === "string") data.content = body.content;
  if (typeof body.categoryId === "string") data.categoryId = body.categoryId;
  if (typeof body.authorId === "string") data.authorId = body.authorId;
  if (typeof body.thumbnailUrl === "string") data.thumbnailUrl = body.thumbnailUrl.trim() || null;
  if (Array.isArray(body.tags)) data.tags = body.tags;
  if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;
  if (typeof body.isFeatured === "boolean") data.isFeatured = body.isFeatured;
  if (typeof body.metaDescription === "string") data.metaDescription = body.metaDescription.trim() || null;

  const updated = await updateArticle(slug, data);

  if (!updated) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ article: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { slug } = await params;
  const deleted = await deleteArticle(slug);

  if (!deleted) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ article: deleted });
}
