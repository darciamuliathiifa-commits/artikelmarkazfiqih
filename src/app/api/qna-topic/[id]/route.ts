import { NextResponse } from "next/server";

import { deleteQnaTopic, updateQnaTopic } from "@/db/queries/qna-topics";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: "Nama topik wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const updated = await updateQnaTopic(id, name);
    if (!updated) {
      return NextResponse.json({ error: "Topik tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ topic: updated });
  } catch {
    return NextResponse.json(
      { error: "Topik dengan nama tersebut sudah ada" },
      { status: 409 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const deleted = await deleteQnaTopic(id);

  if (!deleted) {
    return NextResponse.json({ error: "Topik tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ topic: deleted });
}
