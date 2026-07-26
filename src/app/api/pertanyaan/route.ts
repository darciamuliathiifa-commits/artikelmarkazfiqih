import { NextResponse } from "next/server";

import { createQuestion, getAllQuestions } from "@/db/queries/questions";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const items = await getAllQuestions();
  return NextResponse.json({ questions: items });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const city = typeof body?.city === "string" ? body.city.trim() : "";
  const question = typeof body?.question === "string" ? body.question.trim() : "";

  if (!city || !question) {
    return NextResponse.json(
      { error: "Kota dan pertanyaan wajib diisi" },
      { status: 400 }
    );
  }

  const created = await createQuestion({
    name: typeof body?.name === "string" ? body.name : undefined,
    city,
    question,
    topic: typeof body?.topic === "string" ? body.topic : undefined,
    consent: Boolean(body?.consent),
  });

  return NextResponse.json({ question: created }, { status: 201 });
}
