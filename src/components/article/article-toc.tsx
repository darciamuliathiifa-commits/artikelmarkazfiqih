import type { TocItem } from "@/lib/toc";
import { cn } from "@/lib/utils";

export function ArticleToc({
  items,
  className,
}: {
  items: TocItem[];
  className?: string;
}) {
  if (items.length < 2) return null;

  // Hanya heading level 2 yang dinomori; level 3 tampil menjorok tanpa nomor.
  const sectionNumbers = new Map(
    items
      .filter((item) => item.level === 2)
      .map((item, index) => [item.id, index + 1] as const)
  );

  return (
    <nav
      aria-label="Daftar isi"
      className={cn("mt-8 border-l-2 border-primary/30 py-1 pl-4", className)}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Daftar Isi
      </p>
      <ol className="flex flex-col gap-1.5 text-sm">
        {items.map((item) => {
          const number = sectionNumbers.get(item.id);

          return (
            <li key={item.id} className={number === undefined ? "pl-4" : undefined}>
              <a
                href={`#${item.id}`}
                className="text-muted-foreground hover:text-primary"
              >
                {number === undefined ? "– " : `${number}. `}
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
