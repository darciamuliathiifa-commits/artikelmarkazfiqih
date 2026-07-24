import { NextResponse } from "next/server";

import {
  deleteContributor,
  getAuthorBySlugWithArticles,
  updateContributor,
} from "@/db/queries/authors";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const author = await getAuthorBySlugWithArticles(slug);

  if (!author) {
    return NextResponse.json(
      { error: "Kontributor tidak ditemukan" },
      { status: 404 }
    );
  }

  const origin = new URL(request.url).origin;
  const profileUrl = `${origin}/kontributor/${author.slug}`;
  const metaDescription =
    author.bio ?? `Profil dan tulisan ${author.name} di Markaz Fiqih.`;

  return NextResponse.json({
    id: author.id,
    name: author.name,
    slug: author.slug,
    bio: author.bio,
    longBio: author.longBio,
    avatarUrl: author.avatarUrl,
    websiteUrl: author.websiteUrl,
    facebookUrl: author.facebookUrl,
    articles: author.articles.map((article) => ({
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
    seo: {
      metaTitle: author.name,
      metaDescription,
      canonicalUrl: profileUrl,
      schema: {
        person: personSchema({
          name: author.name,
          description: author.bio,
          url: profileUrl,
          imageUrl: author.avatarUrl,
        }),
        breadcrumb: breadcrumbSchema([
          { name: "Home", url: origin },
          { name: "Kontributor", url: `${origin}/kontributor` },
          { name: author.name, url: profileUrl },
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
  const existing = await getAuthorBySlugWithArticles(slug);

  if (!existing) {
    return NextResponse.json(
      { error: "Kontributor tidak ditemukan" },
      { status: 404 }
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : undefined;

  if (name === "") {
    return NextResponse.json(
      { error: "Nama tidak boleh kosong" },
      { status: 400 }
    );
  }

  const updated = await updateContributor(slug, {
    name,
    bio: typeof body?.bio === "string" ? body.bio : undefined,
    longBio: typeof body?.longBio === "string" ? body.longBio : undefined,
    avatarUrl: typeof body?.avatarUrl === "string" ? body.avatarUrl.trim() || null : undefined,
    websiteUrl: typeof body?.websiteUrl === "string" ? body.websiteUrl.trim() || null : undefined,
    facebookUrl: typeof body?.facebookUrl === "string" ? body.facebookUrl.trim() || null : undefined,
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    bio: updated.bio,
    longBio: updated.longBio,
    avatarUrl: updated.avatarUrl,
    websiteUrl: updated.websiteUrl,
    facebookUrl: updated.facebookUrl,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { slug } = await params;
  const existing = await getAuthorBySlugWithArticles(slug);

  if (!existing) {
    return NextResponse.json(
      { error: "Kontributor tidak ditemukan" },
      { status: 404 }
    );
  }

  try {
    await deleteContributor(slug);
  } catch {
    return NextResponse.json(
      {
        error:
          "Kontributor masih memiliki artikel dan tidak dapat dihapus. Pindahkan atau hapus artikelnya terlebih dahulu.",
      },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true });
}
