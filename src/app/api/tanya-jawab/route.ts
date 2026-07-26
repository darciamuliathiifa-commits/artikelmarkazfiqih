import { NextRequest, NextResponse } from "next/server";

import { createQna, getPaginatedPublishedQna } from "@/db/queries/qna";
import { requireAdminSession } from "@/lib/require-admin-session";
import { validateQnaFields } from "@/lib/validate-qna";

export async function GET(request: NextRequest) {
  const topic = request.nextUrl.searchParams.get("topic") ?? undefined;
  const page = Number(request.nextUrl.searchParams.get("page") ?? 1);

  const result = await getPaginatedPublishedQna({ topicSlug: topic, page });

  return NextResponse.json({
    qna: result.items.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      question: item.question,
      createdAt: item.createdAt,
      answeredBy: {
        name: item.answeredBy.name,
        slug: item.answeredBy.slug,
      },
      topic: item.topic ? { name: item.topic.name, slug: item.topic.slug } : null,
    })),
    pagination: {
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
    },
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
    typeof body.question !== "string" ||
    !body.question.trim() ||
    typeof body.answer !== "string" ||
    !body.answer.trim() ||
    typeof body.answeredById !== "string"
  ) {
    return NextResponse.json(
      { error: "title, question, answer, dan answeredById wajib diisi" },
      { status: 400 }
    );
  }

  const validationError = validateQnaFields(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const created = await createQna({
      title: body.title,
      slug: typeof body.slug === "string" ? body.slug.trim() || undefined : undefined,
      question: body.question,
      answer: body.answer,
      answeredById: body.answeredById,
      topicId: typeof body.topicId === "string" ? body.topicId : null,
      isPublished: body.isPublished === true,
    });

    return NextResponse.json({ qna: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Tanya jawab dengan judul/slug tersebut sudah ada, coba lagi" },
      { status: 409 }
    );
  }
}
