import { NextResponse } from "next/server";

import { createEbook, getPublishedEbooks } from "@/db/queries/ebooks";
import { requireAdminSession } from "@/lib/require-admin-session";

const LIMITS = { title: 200, description: 2000 };

function validateEbookFields(body: Record<string, unknown>): string | null {
  if (typeof body.title === "string") {
    if (!body.title.trim()) return "title tidak boleh kosong";
    if (body.title.length > LIMITS.title)
      return `title maksimal ${LIMITS.title} karakter`;
  }
  if (typeof body.description === "string") {
    if (!body.description.trim()) return "description tidak boleh kosong";
    if (body.description.length > LIMITS.description)
      return `description maksimal ${LIMITS.description} karakter`;
  }
  if (body.previewImages !== undefined) {
    if (
      !Array.isArray(body.previewImages) ||
      body.previewImages.some((url) => typeof url !== "string")
    ) {
      return "previewImages harus berupa array string";
    }
  }
  return null;
}

export async function GET() {
  const items = await getPublishedEbooks();
  return NextResponse.json({
    ebooks: items.map((item) => ({
      slug: item.slug,
      title: item.title,
      coverImageUrl: item.coverImageUrl,
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
    typeof body.description !== "string" ||
    !body.description.trim()
  ) {
    return NextResponse.json(
      { error: "title dan description wajib diisi" },
      { status: 400 }
    );
  }

  const validationError = validateEbookFields(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const created = await createEbook({
      title: body.title,
      slug: typeof body.slug === "string" ? body.slug.trim() || undefined : undefined,
      description: body.description,
      coverImageUrl:
        typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() || null : null,
      previewImages: Array.isArray(body.previewImages) ? body.previewImages : undefined,
      purchaseUrl:
        typeof body.purchaseUrl === "string" ? body.purchaseUrl.trim() || null : null,
      isPublished: body.isPublished === true,
    });

    return NextResponse.json({ ebook: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "E-book dengan judul/slug tersebut sudah ada, coba lagi" },
      { status: 409 }
    );
  }
}
