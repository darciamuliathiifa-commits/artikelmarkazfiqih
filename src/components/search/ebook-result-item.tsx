import Link from "next/link";
import { BookOpen } from "lucide-react";

import type { Ebook } from "@/db/schema";
import { HighlightText } from "@/components/search/highlight-text";

export function EbookResultItem({ ebook, query }: { ebook: Ebook; query: string }) {
  return (
    <Link
      href={`/e-book/${ebook.slug}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40"
    >
      <BookOpen className="size-4 shrink-0 text-primary" />
      <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
        <HighlightText text={ebook.title} query={query} />
      </h3>
    </Link>
  );
}
