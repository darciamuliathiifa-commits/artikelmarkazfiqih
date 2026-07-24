import { NextResponse } from "next/server";

import { getAllSettings, updateSettings } from "@/db/queries/settings";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const settings = await getAllSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Payload tidak valid" },
      { status: 400 }
    );
  }

  const entries: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      entries[key] = value;
    }
  }

  if (Object.keys(entries).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada pengaturan yang valid untuk diperbarui" },
      { status: 400 }
    );
  }

  try {
    const updated = await updateSettings(entries);
    return NextResponse.json({ settings: updated });
  } catch (error) {
    console.error("PATCH /api/pengaturan failed:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan" },
      { status: 500 }
    );
  }
}
