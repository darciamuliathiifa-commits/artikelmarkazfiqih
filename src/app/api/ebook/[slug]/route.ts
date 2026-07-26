import { NextResponse } from "next/server";

import {
  deleteEbook,
  getPublishedEbookBySlug,
  updateEbook,
} from "@/db/queries/ebooks";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = await getPublishedEbookBySlug(slug);

  if (!item) {
    return NextResponse.json({ error: "E-book tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ ebook: item });
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

  const data: Parameters<typeof updateEbook>[1] = {};

  if (typeof body.title === "string") {
    const trimmed = body.title.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 });
    }
    data.title = trimmed;
  }
  if (typeof body.description === "string") {
    const trimmed = body.description.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Deskripsi wajib diisi" }, { status: 400 });
    }
    data.description = trimmed;
  }
  if (typeof body.coverImageUrl === "string") {
    data.coverImageUrl = body.coverImageUrl.trim() || null;
  }
  if (Array.isArray(body.previewImages)) {
    if (body.previewImages.some((url: unknown) => typeof url !== "string")) {
      return NextResponse.json(
        { error: "previewImages harus berupa array string" },
        { status: 400 }
      );
    }
    data.previewImages = body.previewImages;
  }
  if (typeof body.purchaseUrl === "string") {
    data.purchaseUrl = body.purchaseUrl.trim() || null;
  }
  if (typeof body.isPublished === "boolean") {
    data.isPublished = body.isPublished;
  }

  const updated = await updateEbook(slug, data);

  if (!updated) {
    return NextResponse.json({ error: "E-book tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ ebook: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { slug } = await params;
  const deleted = await deleteEbook(slug);

  if (!deleted) {
    return NextResponse.json({ error: "E-book tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ ebook: deleted });
}
