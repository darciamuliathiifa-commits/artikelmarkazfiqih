import { NextResponse } from "next/server";

import { deleteTag, updateTag } from "@/db/queries/tags";
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
      { error: "Nama tag wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const updated = await updateTag(id, name);
    if (!updated) {
      return NextResponse.json({ error: "Tag tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ tag: updated });
  } catch {
    return NextResponse.json(
      { error: "Tag dengan nama tersebut sudah ada" },
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
  const deleted = await deleteTag(id);

  if (!deleted) {
    return NextResponse.json({ error: "Tag tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ tag: deleted });
}
