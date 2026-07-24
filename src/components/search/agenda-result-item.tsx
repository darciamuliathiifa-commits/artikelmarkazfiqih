import Link from "next/link";
import { CalendarDays } from "lucide-react";

import type { Agenda } from "@/db/schema";
import { HighlightText } from "@/components/search/highlight-text";

export function AgendaResultItem({
  agenda,
  query,
}: {
  agenda: Agenda;
  query: string;
}) {
  return (
    <article className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
        <Link href={`/agenda/${agenda.id}`} className="hover:text-primary">
          <HighlightText text={agenda.title} query={query} />
        </Link>
      </h3>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="size-3.5 shrink-0" />
        {agenda.scheduleText}
      </span>
    </article>
  );
}
