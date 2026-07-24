import { NextResponse } from "next/server";

import { createAgenda, getAllAgendaForAdmin } from "@/db/queries/agenda";
import { requireAdminSession } from "@/lib/require-admin-session";

const VALID_TYPES = ["rutin", "khusus"];

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const items = await getAllAgendaForAdmin();
  return NextResponse.json({ agenda: items });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json().catch(() => null);

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const scheduleText =
    typeof body?.scheduleText === "string" ? body.scheduleText.trim() : "";
  const type = VALID_TYPES.includes(body?.type) ? body.type : "rutin";

  if (!title || !scheduleText) {
    return NextResponse.json(
      { error: "Judul dan jadwal wajib diisi" },
      { status: 400 }
    );
  }

  const created = await createAgenda({
    title,
    type,
    scheduleText,
    description:
      typeof body?.description === "string" ? body.description.trim() || null : null,
    pengajar:
      typeof body?.pengajar === "string" ? body.pengajar.trim() || null : null,
    imageUrl:
      typeof body?.imageUrl === "string" ? body.imageUrl.trim() || null : null,
    linkUrl: typeof body?.linkUrl === "string" ? body.linkUrl.trim() || null : null,
    isPublished: body?.isPublished === true,
  });

  return NextResponse.json({ agenda: created }, { status: 201 });
}
