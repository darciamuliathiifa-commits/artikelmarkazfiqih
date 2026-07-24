import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { AgendaEditorForm } from "@/components/admin/agenda-editor-form";
import { getAgendaById } from "@/db/queries/agenda";

export const metadata: Metadata = {
  title: "Edit Agenda",
  robots: { index: false, follow: false },
};

export default async function EditAgendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getAgendaById(id);

  if (!item) {
    notFound();
  }

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
        Edit Agenda
      </h1>
      <AgendaEditorForm
        submitLabel="Simpan Perubahan"
        initialValues={{
          id: item.id,
          title: item.title,
          type: item.type,
          scheduleText: item.scheduleText,
          description: item.description ?? "",
          pengajar: item.pengajar ?? "",
          imageUrl: item.imageUrl ?? "",
          linkUrl: item.linkUrl ?? "",
          isPublished: item.isPublished,
        }}
      />
    </div>
  );
}
