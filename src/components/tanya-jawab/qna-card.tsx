import Link from "next/link";

import type { QnaListItem } from "@/lib/data/qna";
import { formatDate } from "@/lib/format";

export function QnaCard({ qna }: { qna: QnaListItem }) {
  return (
    <Link
      href={`/tanya-jawab/${qna.slug}`}
      className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      {qna.topic && (
        <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {qna.topic.name}
        </span>
      )}
      <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
        {qna.title}
      </h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{qna.question}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {qna.answeredBy && (
          <span className="font-medium text-foreground">
            Dijawab oleh {qna.answeredBy.name}
          </span>
        )}
        <span>{formatDate(qna.createdAt)}</span>
      </div>
    </Link>
  );
}
