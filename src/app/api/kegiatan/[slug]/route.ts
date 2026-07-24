import { NextResponse } from "next/server";

import {
  deleteKegiatan,
  getPublishedKegiatanBySlug,
  updateKegiatan,
} from "@/db/queries/kegiatan";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = await getPublishedKegiatanBySlug(slug);

  if (!item) {
    return NextResponse.json({ error: "Kegiatan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ kegiatan: item });
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

  const data: Parameters<typeof updateKegiatan>[1] = {};

  if (typeof body.title === "string") {
    const trimmed = body.title.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 });
    }
    data.title = trimmed;
  }
  if (typeof body.excerpt === "string") {
    const trimmed = body.excerpt.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Ringkasan wajib diisi" }, { status: 400 });
    }
    data.excerpt = trimmed;
  }
  if (typeof body.content === "string") {
    if (!body.content.trim()) {
      return NextResponse.json({ error: "Konten wajib diisi" }, { status: 400 });
    }
    data.content = body.content;
  }
  if (typeof body.thumbnailUrl === "string") {
    data.thumbnailUrl = body.thumbnailUrl.trim() || null;
  }
  if (body.eventDate === null || typeof body.eventDate === "string") {
    data.eventDate = body.eventDate ? new Date(body.eventDate) : null;
  }
  if (typeof body.isPublished === "boolean") {
    data.isPublished = body.isPublished;
  }
  if (typeof body.isFeatured === "boolean") {
    data.isFeatured = body.isFeatured;
  }

  const updated = await updateKegiatan(slug, data);

  if (!updated) {
    return NextResponse.json({ error: "Kegiatan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ kegiatan: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { slug } = await params;
  const deleted = await deleteKegiatan(slug);

  if (!deleted) {
    return NextResponse.json({ error: "Kegiatan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ kegiatan: deleted });
}
