import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { ContributorEditorForm } from "@/components/admin/contributor-editor-form";

export const metadata: Metadata = {
  title: "Tambah Kontributor",
  robots: { index: false, follow: false },
};

export default function NewContributorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/admin/kontributor"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar kontributor
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Tambah Kontributor
      </h1>

      <ContributorEditorForm />
    </div>
  );
}
