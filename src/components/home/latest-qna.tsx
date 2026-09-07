import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getPaginatedQna, type QnaListItem } from "@/lib/data/qna";
import { QnaCard } from "@/components/tanya-jawab/qna-card";

export async function LatestQna() {
  let items: QnaListItem[] = [];
  try {
    const result = await getPaginatedQna({ page: 1, pageSize: 3 });
    items = result.items;
  } catch (err) {
    console.warn("LatestQna DB query fallback:", err);
  }

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-3 pb-10">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Tanya Jawab
        </h2>
        <Link
          href="/tanya-jawab"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Lihat Semua
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {items.map((qna) => (
          <QnaCard key={qna.slug} qna={qna} />
        ))}
      </div>
    </section>
  );
}
