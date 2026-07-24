import Link from "next/link";
import type { Metadata } from "next";
import { Pencil } from "lucide-react";

import { getAllPages } from "@/db/queries/pages";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kelola Halaman Statis",
  robots: { index: false, follow: false },
};

export default async function AdminStaticPagesPage() {
  const staticPages = await getAllPages();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
        Kelola Halaman Statis
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Ubah konten halaman Tentang Kami, Kebijakan Privasi, Disclaimer, dan
        Donasi tanpa menyentuh kode.
      </p>

      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {staticPages.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/halaman-statis/${page.slug}`}
            className="flex items-center justify-between gap-4 p-4 hover:bg-muted"
          >
            <div>
              <p className="font-heading text-sm font-semibold text-foreground">
                {page.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Terakhir diperbarui: {formatDate(page.updatedAt.toISOString())}
              </p>
            </div>
            <Pencil className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
