import { NextResponse } from "next/server";

import { getSettings } from "@/db/queries/settings";

export async function GET() {
  const settings = await getSettings([
    "address",
    "whatsapp_number",
    "whatsapp_url",
    "email",
  ]);

  return NextResponse.json({
    address: settings.address ?? null,
    whatsappNumber: settings.whatsapp_number ?? null,
    whatsappUrl: settings.whatsapp_url ?? null,
    email: settings.email ?? null,
  });
}
