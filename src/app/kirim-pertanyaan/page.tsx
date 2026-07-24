import type { Metadata } from "next";

import { KirimPertanyaanForm } from "@/components/kirim-pertanyaan/kirim-pertanyaan-form";
import { getAllQnaTopics } from "@/db/queries/qna-topics";

export const metadata: Metadata = {
  title: "Kirim Pertanyaan",
  description:
    "Kirimkan pertanyaan seputar fiqih kepada tim redaksi Markaz Fiqih.",
};

export default async function KirimPertanyaanPage() {
  const topics = await getAllQnaTopics();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="max-w-2xl">
        <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
          Kirim Pertanyaan
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Punya pertanyaan seputar fiqih? Kirimkan pertanyaan Anda dan tim
          redaksi Markaz Fiqih akan menjawabnya.
        </p>

        <KirimPertanyaanForm topics={topics} />
      </div>
    </div>
  );
}
