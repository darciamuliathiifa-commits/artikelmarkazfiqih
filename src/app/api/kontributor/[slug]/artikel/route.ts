import { NextRequest, NextResponse } from "next/server";

import { getArticlesByAuthorPaginated } from "@/db/queries/authors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") ?? 6);
  const offset = Number(searchParams.get("offset") ?? 0);

  const result = await getArticlesByAuthorPaginated(slug, { limit, offset });

  if (!result) {
    return NextResponse.json(
      { error: "Kontributor tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    articles: result.items.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      thumbnailUrl: article.thumbnailUrl,
      views: article.views,
      publishedAt: article.publishedAt,
      category: {
        name: article.category.name,
        slug: article.category.slug,
      },
    })),
    total: result.total,
    limit,
    offset,
    hasMore: offset + result.items.length < result.total,
  });
}
