import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { CalendarDays, User, ExternalLink, Play } from "lucide-react";

import { getPublishedAgenda } from "@/db/queries/agenda";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import type { Agenda } from "@/db/schema";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export const metadata: Metadata = {
  title: "Agenda",
  description:
    "Jadwal kajian rutin dan acara khusus dari Markaz Fiqih.",
};

function AgendaCard({ item }: { item: Agenda }) {
  const isVideo = item.linkUrl ? Boolean(getYoutubeEmbedUrl(item.linkUrl)) : false;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      {item.imageUrl && (
        <Link
          href={`/agenda/${item.id}`}
          className="group relative block aspect-video w-full overflow-hidden bg-muted"
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-[1.03]"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
              <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm">
                <Play className="size-5 translate-x-0.5 fill-current" />
              </span>
            </div>
          )}
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-base font-bold text-foreground">
          <Link href={`/agenda/${item.id}`} className="hover:text-primary">
            {item.title}
          </Link>
        </h3>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" />
          {item.scheduleText}
        </span>
        {item.pengajar && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="size-3.5 shrink-0" />
            {item.pengajar}
          </span>
        )}
        {item.description && (
          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Button size="sm" variant="outline" render={<Link href={`/agenda/${item.id}`} />}>
            {item.description || isVideo ? "Selengkapnya" : "Lihat Detail"}
          </Button>
          {item.linkUrl && (
            <Button
              size="sm"
              render={
                <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              {isVideo ? "Tonton di YouTube" : "Info Lebih Lanjut"}
              <ExternalLink className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function AgendaPage() {
  const items = await getPublishedAgenda();
  const rutin = items.filter((item) => item.type === "rutin");
  const khusus = items.filter((item) => item.type === "khusus");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Agenda
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Jadwal kajian rutin dan acara khusus dari Markaz Fiqih.
          </p>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada agenda yang ditampilkan.
            </p>
          ) : (
            <div className="flex flex-col gap-10">
              {rutin.length > 0 && (
                <div>
                  <h2 className="relative mb-5 inline-block pb-2 font-heading text-lg font-bold text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
                    Jadwal Rutin
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {rutin.map((item) => (
                      <AgendaCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {khusus.length > 0 && (
                <div>
                  <h2 className="relative mb-5 inline-block pb-2 font-heading text-lg font-bold text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
                    Acara Khusus
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {khusus.map((item) => (
                      <AgendaCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
