import { NextRequest, NextResponse } from "next/server";

import { createArticle, getPaginatedPublishedArticles } from "@/db/queries/articles";
import { validateArticleFields } from "@/lib/validate-article";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") ?? undefined;
  const page = Number(request.nextUrl.searchParams.get("page") ?? 1);

  const result = await getPaginatedPublishedArticles({ categorySlug: category, page });

  return NextResponse.json({
    articles: result.items.map((article) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      thumbnailUrl: article.thumbnailUrl,
      publishedAt: (article.publishedAt ?? article.createdAt).toISOString(),
      views: article.views,
      category: { name: article.category.name, slug: article.category.slug },
      author: { name: article.author.name, slug: article.author.slug },
    })),
    pagination: {
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
    },
  });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.excerpt !== "string" ||
    typeof body.content !== "string" ||
    typeof body.categoryId !== "string" ||
    typeof body.authorId !== "string"
  ) {
    return NextResponse.json(
      { error: "title, excerpt, content, categoryId, dan authorId wajib diisi" },
      { status: 400 }
    );
  }

  const validationError = validateArticleFields(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const created = await createArticle({
      title: body.title,
      slug: typeof body.slug === "string" ? body.slug.trim() || undefined : undefined,
      excerpt: body.excerpt,
      content: body.content,
      categoryId: body.categoryId,
      authorId: body.authorId,
      thumbnailUrl: typeof body.thumbnailUrl === "string" ? body.thumbnailUrl.trim() || undefined : undefined,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      isPublished: body.isPublished === true,
      isFeatured: body.isFeatured === true,
      metaDescription:
        typeof body.metaDescription === "string" ? body.metaDescription.trim() || undefined : undefined,
    });

    return NextResponse.json({ article: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Artikel dengan judul/slug tersebut sudah ada, coba lagi" },
      { status: 409 }
    );
  }
}
