import { NextResponse } from "next/server";

import { createQnaTopic, getAllQnaTopics } from "@/db/queries/qna-topics";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const topics = await getAllQnaTopics();
  return NextResponse.json({ topics });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: "Nama topik wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const created = await createQnaTopic(name);
    return NextResponse.json({ topic: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Topik dengan nama tersebut sudah ada" },
      { status: 409 }
    );
  }
}
