import { NextResponse } from "next/server";

import { incrementArticleViews } from "@/db/queries/articles";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const updated = await incrementArticleViews(slug);

  if (!updated) {
    return NextResponse.json(
      { error: "Artikel tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ views: updated.views });
}
