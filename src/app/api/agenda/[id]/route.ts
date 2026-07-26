import { NextResponse } from "next/server";

import { deleteAgenda, getAgendaById, updateAgenda } from "@/db/queries/agenda";
import { requireAdminSession } from "@/lib/require-admin-session";

const VALID_TYPES = ["rutin", "khusus"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const item = await getAgendaById(id);

  if (!item) {
    return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ agenda: item });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};

  if (typeof body.title === "string") {
    const trimmed = body.title.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 });
    }
    data.title = trimmed;
  }
  if (typeof body.scheduleText === "string") {
    const trimmed = body.scheduleText.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Jadwal wajib diisi" }, { status: 400 });
    }
    data.scheduleText = trimmed;
  }
  if (VALID_TYPES.includes(body.type)) {
    data.type = body.type;
  }
  if (typeof body.description === "string") {
    data.description = body.description.trim() || null;
  }
  if (typeof body.pengajar === "string") {
    data.pengajar = body.pengajar.trim() || null;
  }
  if (typeof body.imageUrl === "string") {
    data.imageUrl = body.imageUrl.trim() || null;
  }
  if (typeof body.linkUrl === "string") {
    data.linkUrl = body.linkUrl.trim() || null;
  }
  if (typeof body.isPublished === "boolean") {
    data.isPublished = body.isPublished;
  }

  const updated = await updateAgenda(id, data);

  if (!updated) {
    return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ agenda: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const deleted = await deleteAgenda(id);

  if (!deleted) {
    return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ agenda: deleted });
}
