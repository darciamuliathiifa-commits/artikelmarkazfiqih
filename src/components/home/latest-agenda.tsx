import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";

import { getLatestAgenda } from "@/db/queries/agenda";

const FALLBACK_THUMBNAIL = "/images/banner-pattern.webp";

export async function LatestAgenda() {
  const items = await getLatestAgenda(3);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-3">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Agenda
        </h2>
        <Link
          href="/agenda"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Lihat Semua
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/agenda/${item.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <Image
                src={item.imageUrl || FALLBACK_THUMBNAIL}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="font-heading text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                {item.title}
              </h3>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" />
                {item.scheduleText}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
