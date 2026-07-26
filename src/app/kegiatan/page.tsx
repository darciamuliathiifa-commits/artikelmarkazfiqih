import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { getPublishedKegiatan } from "@/db/queries/kegiatan";
import { formatDate } from "@/lib/format";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export const metadata: Metadata = {
  title: "Kegiatan",
  description: "Dokumentasi kegiatan dan aktivitas Markaz Fiqih.",
};

const FALLBACK_THUMBNAIL = "/images/banner-pattern.webp";

export default async function KegiatanPage() {
  const items = await getPublishedKegiatan();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Kegiatan
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Dokumentasi kegiatan dan aktivitas Markaz Fiqih.
          </p>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada kegiatan yang ditampilkan.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                      sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
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
          )}
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
