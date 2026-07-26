import { NextResponse } from "next/server";

import { createKegiatan, getPublishedKegiatan } from "@/db/queries/kegiatan";
import { requireAdminSession } from "@/lib/require-admin-session";

const LIMITS = { title: 200, excerpt: 500 };

function validateKegiatanFields(body: Record<string, unknown>): string | null {
  if (typeof body.title === "string") {
    if (!body.title.trim()) return "title tidak boleh kosong";
    if (body.title.length > LIMITS.title)
      return `title maksimal ${LIMITS.title} karakter`;
  }
  if (typeof body.excerpt === "string") {
    if (!body.excerpt.trim()) return "excerpt tidak boleh kosong";
    if (body.excerpt.length > LIMITS.excerpt)
      return `excerpt maksimal ${LIMITS.excerpt} karakter`;
  }
  if (typeof body.content === "string" && !body.content.trim()) {
    return "content tidak boleh kosong";
  }
  return null;
}

export async function GET() {
  const items = await getPublishedKegiatan();
  return NextResponse.json({
    kegiatan: items.map((item) => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      thumbnailUrl: item.thumbnailUrl,
      eventDate: item.eventDate,
    })),
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
    typeof body.content !== "string"
  ) {
    return NextResponse.json(
      { error: "title, excerpt, dan content wajib diisi" },
      { status: 400 }
    );
  }

  const validationError = validateKegiatanFields(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const created = await createKegiatan({
      title: body.title,
      slug: typeof body.slug === "string" ? body.slug.trim() || undefined : undefined,
      excerpt: body.excerpt,
      content: body.content,
      thumbnailUrl:
        typeof body.thumbnailUrl === "string" ? body.thumbnailUrl.trim() || undefined : undefined,
      eventDate: typeof body.eventDate === "string" && body.eventDate ? new Date(body.eventDate) : null,
      isPublished: body.isPublished === true,
      isFeatured: body.isFeatured === true,
    });

    return NextResponse.json({ kegiatan: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Kegiatan dengan judul/slug tersebut sudah ada, coba lagi" },
      { status: 409 }
    );
  }
}
