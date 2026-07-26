import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { getFeaturedKegiatan } from "@/db/queries/kegiatan";
import { formatDate } from "@/lib/format";

const FALLBACK_THUMBNAIL = "/images/banner-pattern.webp";

export async function LatestKegiatan() {
  const items = await getFeaturedKegiatan(3);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-3 pb-10">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Kegiatan
        </h2>
        <Link
          href="/kegiatan"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Lihat Semua
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.slug}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
          >
            <Link
              href={`/kegiatan/${item.slug}`}
              className="relative block aspect-16/10 w-full overflow-hidden bg-muted"
            >
              <Image
                src={item.thumbnailUrl || FALLBACK_THUMBNAIL}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform group-hover:scale-[1.03]"
              />
            </Link>

            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
                <Link href={`/kegiatan/${item.slug}`} className="hover:text-primary">
                  {item.title}
                </Link>
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {item.excerpt}
              </p>
              {item.eventDate && (
                <span className="mt-auto pt-3 text-xs text-muted-foreground">
                  {formatDate(item.eventDate.toISOString())}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
