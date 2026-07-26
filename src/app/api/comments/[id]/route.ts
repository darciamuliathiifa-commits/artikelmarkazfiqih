import { NextResponse } from "next/server";

import { deleteComment, setCommentApproval } from "@/db/queries/comments";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (typeof body?.isApproved !== "boolean") {
    return NextResponse.json(
      { error: "isApproved harus berupa boolean" },
      { status: 400 }
    );
  }

  const updated = await setCommentApproval(id, body.isApproved);

  if (!updated) {
    return NextResponse.json({ error: "Komentar tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ comment: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const deleted = await deleteComment(id);

  if (!deleted) {
    return NextResponse.json({ error: "Komentar tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ comment: deleted });
}
