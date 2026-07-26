import path from "node:path";

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { createMedia, getAllMedia } from "@/db/queries/media";
import { requireAdminSession } from "@/lib/require-admin-session";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const items = await getAllMedia();
    return NextResponse.json({ media: items });
  } catch (error) {
    console.error("GET /api/media failed:", error);
    return NextResponse.json(
      { error: "Gagal memuat galeri media" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "File gambar wajib disertakan (field 'file')" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipe file tidak didukung. Gunakan PNG, JPEG, WEBP, atau GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Ukuran file maksimal 5MB." },
      { status: 400 }
    );
  }

  const alt = formData?.get("alt");
  const extension = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${crypto.randomUUID()}${extension}`;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("POST /api/media failed: BLOB_READ_WRITE_TOKEN is not configured");
    return NextResponse.json(
      {
        error:
          "Penyimpanan gambar belum dikonfigurasi di server (Vercel Blob belum terhubung). Hubungi developer.",
      },
      { status: 500 }
    );
  }

  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    const created = await createMedia({
      url: blob.url,
      alt: typeof alt === "string" ? alt : undefined,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    });

    return NextResponse.json({ media: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/media failed:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah gambar ke penyimpanan" },
      { status: 500 }
    );
  }
}
