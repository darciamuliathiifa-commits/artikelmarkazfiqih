import { NextResponse } from "next/server";

import { deleteQna, getQnaBySlug, updateQna } from "@/db/queries/qna";
import { breadcrumbSchema } from "@/lib/schema";
import { requireAdminSession } from "@/lib/require-admin-session";
import { validateQnaFields } from "@/lib/validate-qna";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = await getQnaBySlug(slug);

  if (!item || !item.isPublished) {
    return NextResponse.json(
      { error: "Tanya jawab tidak ditemukan" },
      { status: 404 }
    );
  }

  const origin = new URL(request.url).origin;
  const qnaUrl = `${origin}/tanya-jawab/${item.slug}`;

  return NextResponse.json({
    id: item.id,
    title: item.title,
    slug: item.slug,
    question: item.question,
    answer: item.answer,
    createdAt: item.createdAt,
    answeredBy: {
      name: item.answeredBy.name,
      slug: item.answeredBy.slug,
      avatarUrl: item.answeredBy.avatarUrl,
      bio: item.answeredBy.bio,
    },
    topic: item.topic ? { name: item.topic.name, slug: item.topic.slug } : null,
    seo: {
      metaTitle: item.title,
      metaDescription: item.question,
      canonicalUrl: qnaUrl,
      schema: {
        breadcrumb: breadcrumbSchema([
          { name: "Home", url: origin },
          { name: "Tanya Jawab", url: `${origin}/tanya-jawab` },
          { name: item.title, url: qnaUrl },
        ]),
      },
    },
  });
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

  const validationError = validateQnaFields(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const data: Parameters<typeof updateQna>[1] = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.question === "string") data.question = body.question;
  if (typeof body.answer === "string") data.answer = body.answer;
  if (typeof body.answeredById === "string") data.answeredById = body.answeredById;
  if (typeof body.topicId === "string" || body.topicId === null) {
    data.topicId = body.topicId;
  }
  if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;

  const updated = await updateQna(slug, data);

  if (!updated) {
    return NextResponse.json(
      { error: "Tanya jawab tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ qna: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { slug } = await params;
  const deleted = await deleteQna(slug);

  if (!deleted) {
    return NextResponse.json(
      { error: "Tanya jawab tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ qna: deleted });
}
