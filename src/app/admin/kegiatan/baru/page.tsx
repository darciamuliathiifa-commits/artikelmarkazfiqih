import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { KegiatanEditorForm } from "@/components/admin/kegiatan-editor-form";

export const metadata: Metadata = {
  title: "Tambah Kegiatan",
  robots: { index: false, follow: false },
};

export default function NewKegiatanPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/admin/kegiatan"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar kegiatan
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Tambah Kegiatan
      </h1>

      <KegiatanEditorForm />
    </div>
  );
}
