import Link from "next/link";

import type { QnaListItem } from "@/lib/data/qna";
import { formatDate, stripHtml } from "@/lib/format";
import { HighlightText } from "@/components/search/highlight-text";

export function QnaResultItem({ qna, query }: { qna: QnaListItem; query: string }) {
  const { answeredBy } = qna;

  return (
    <article className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
        <Link href={`/tanya-jawab/${qna.slug}`} className="hover:text-primary">
          <HighlightText text={qna.title} query={query} />
        </Link>
      </h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        <HighlightText text={stripHtml(qna.answer)} query={query} />
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {answeredBy && (
          <span>
            Dijawab oleh{" "}
            <Link
              href={`/kontributor/${answeredBy.slug}`}
              className="font-medium text-foreground hover:text-primary"
            >
              {answeredBy.name}
            </Link>
          </span>
        )}
        <span>{formatDate(qna.createdAt)}</span>
      </div>
    </article>
  );
}
