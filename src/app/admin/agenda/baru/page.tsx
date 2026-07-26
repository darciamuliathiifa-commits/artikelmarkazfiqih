import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { AgendaEditorForm } from "@/components/admin/agenda-editor-form";

export const metadata: Metadata = {
  title: "Tambah Agenda",
  robots: { index: false, follow: false },
};

export default function NewAgendaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/admin/agenda"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar agenda
      </Link>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Tambah Agenda
      </h1>
      <AgendaEditorForm />
    </div>
  );
}
