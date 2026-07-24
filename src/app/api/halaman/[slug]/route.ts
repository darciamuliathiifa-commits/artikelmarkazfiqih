import { NextResponse } from "next/server";

import { getPageBySlug, updatePageContent } from "@/db/queries/pages";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return NextResponse.json(
      { error: "Halaman tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    slug: page.slug,
    title: page.title,
    content: page.content,
    updatedAt: page.updatedAt,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { slug } = await params;
  const existing = await getPageBySlug(slug);

  if (!existing) {
    return NextResponse.json(
      { error: "Halaman tidak ditemukan" },
      { status: 404 }
    );
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : undefined;
  const content =
    typeof body?.content === "string" ? body.content.trim() : undefined;

  if (title === "" || content === "") {
    return NextResponse.json(
      { error: "Judul dan konten tidak boleh kosong" },
      { status: 400 }
    );
  }

  try {
    const updated = await updatePageContent(slug, { title, content });

    return NextResponse.json({
      slug: updated.slug,
      title: updated.title,
      content: updated.content,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    console.error("PATCH /api/halaman/[slug] failed:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan halaman" },
      { status: 500 }
    );
  }
}
