import { NextResponse } from "next/server";

import { createContributor, getAllContributors } from "@/db/queries/authors";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET() {
  const contributors = await getAllContributors();

  return NextResponse.json({
    contributors: contributors.map((contributor) => ({
      id: contributor.id,
      name: contributor.name,
      slug: contributor.slug,
      bio: contributor.bio,
      avatarUrl: contributor.avatarUrl,
      articleCount: contributor.articleCount,
    })),
  });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: "Nama kontributor wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const created = await createContributor({
      name,
      bio: typeof body?.bio === "string" ? body.bio : undefined,
      longBio: typeof body?.longBio === "string" ? body.longBio : undefined,
      avatarUrl: typeof body?.avatarUrl === "string" ? body.avatarUrl.trim() || undefined : undefined,
      websiteUrl: typeof body?.websiteUrl === "string" ? body.websiteUrl.trim() || undefined : undefined,
      facebookUrl: typeof body?.facebookUrl === "string" ? body.facebookUrl.trim() || undefined : undefined,
    });

    return NextResponse.json(
      {
        id: created.id,
        name: created.name,
        slug: created.slug,
        bio: created.bio,
        longBio: created.longBio,
        avatarUrl: created.avatarUrl,
        websiteUrl: created.websiteUrl,
        facebookUrl: created.facebookUrl,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Kontributor dengan nama tersebut sudah ada, coba lagi" },
      { status: 409 }
    );
  }
}
