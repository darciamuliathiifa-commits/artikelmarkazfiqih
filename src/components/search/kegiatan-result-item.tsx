import Link from "next/link";

import type { Kegiatan } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { HighlightText } from "@/components/search/highlight-text";

export function KegiatanResultItem({
  kegiatan,
  query,
}: {
  kegiatan: Kegiatan;
  query: string;
}) {
  return (
    <article className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
        <Link href={`/kegiatan/${kegiatan.slug}`} className="hover:text-primary">
          <HighlightText text={kegiatan.title} query={query} />
        </Link>
      </h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        <HighlightText text={kegiatan.excerpt} query={query} />
      </p>
      {kegiatan.eventDate && (
        <span className="text-xs text-muted-foreground">
          {formatDate(kegiatan.eventDate.toISOString())}
        </span>
      )}
    </article>
  );
}
