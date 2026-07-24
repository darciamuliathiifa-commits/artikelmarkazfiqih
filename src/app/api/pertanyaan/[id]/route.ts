import { NextResponse } from "next/server";

import { deleteQuestion, updateQuestionStatus } from "@/db/queries/questions";
import { requireAdminSession } from "@/lib/require-admin-session";

const VALID_STATUSES = ["belum_dijawab", "sudah_dijawab", "diarsipkan"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status harus salah satu dari: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const updated = await updateQuestionStatus(id, status);

  if (!updated) {
    return NextResponse.json(
      { error: "Pertanyaan tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ question: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await params;
  const deleted = await deleteQuestion(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Pertanyaan tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ question: deleted });
}
