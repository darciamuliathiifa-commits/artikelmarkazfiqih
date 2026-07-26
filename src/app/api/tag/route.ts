import { NextResponse } from "next/server";

import { createTag, getAllTags } from "@/db/queries/tags";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const tags = await getAllTags();
  return NextResponse.json({ tags });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: "Nama tag wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const created = await createTag(name);
    return NextResponse.json({ tag: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Tag dengan nama tersebut sudah ada" },
      { status: 409 }
    );
  }
}
