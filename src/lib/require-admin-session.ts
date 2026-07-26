import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

/**
 * Guards an API route handler to admin-only callers. Returns a 401
 * NextResponse if the caller isn't an authenticated admin, or null if the
 * request may proceed.
 */
export async function requireAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  return null;
}
