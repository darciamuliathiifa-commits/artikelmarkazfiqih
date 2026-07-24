import { NextResponse } from "next/server";

import {
  createComment,
  findArticleIdBySlug,
  findQnaIdBySlug,
} from "@/db/queries/comments";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  const articleSlug =
    typeof body?.articleSlug === "string" ? body.articleSlug : undefined;
  const qnaSlug = typeof body?.qnaSlug === "string" ? body.qnaSlug : undefined;

  // Honeypot: bots fill hidden fields, real users leave them blank.
  if (typeof body?.website === "string" && body.website.trim()) {
    return NextResponse.json({ comment: null }, { status: 201 });
  }

  if (!name || !email || !content) {
    return NextResponse.json(
      { error: "Nama, email, dan komentar wajib diisi" },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Format email tidak valid" },
      { status: 400 }
    );
  }

  if (!articleSlug && !qnaSlug) {
    return NextResponse.json(
      { error: "Konten yang dikomentari tidak ditemukan" },
      { status: 400 }
    );
  }

  const articleId = articleSlug ? await findArticleIdBySlug(articleSlug) : undefined;
  const qnaId = qnaSlug ? await findQnaIdBySlug(qnaSlug) : undefined;

  if (!articleId && !qnaId) {
    return NextResponse.json(
      { error: "Konten yang dikomentari tidak ditemukan" },
      { status: 404 }
    );
  }

  const created = await createComment({ name, email, content, articleId, qnaId });

  return NextResponse.json({ comment: created }, { status: 201 });
}
