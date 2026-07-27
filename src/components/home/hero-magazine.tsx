import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { getFeaturedArticles, getLatestArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";

export async function HeroMagazine() {
  let hero = null;
  let side = null;
  try {
    const featured = await getFeaturedArticles(2);
    const articles = featured.length >= 2 ? featured : await getLatestArticles(2);
    if (articles.length > 0) {
      hero = articles[0];
      side = articles[1];
    }
  } catch (err) {
    console.warn("HeroMagazine DB query fallback:", err);
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-3 pb-6 sm:pt-4 sm:pb-6">
      <div className="grid grid-cols-1 items-center gap-3 border-b border-border pb-3 text-center sm:gap-4 sm:pb-4 lg:grid-cols-3 lg:text-left">
        <h1 className="min-w-0 font-heading text-xl font-extrabold leading-snug tracking-tight text-foreground sm:text-2xl lg:col-span-2 lg:text-3xl lg:leading-[1.25]">
          Pusat Rujukan Fiqih
          <br />
          Berlandaskan Madzhab Syafi&apos;i
        </h1>
        <div className="flex flex-col items-center gap-2 sm:gap-2.5 sm:max-w-xs lg:col-span-1 lg:items-start">
          <p className="text-xs text-muted-foreground sm:text-sm">
            Punya pertanyaan seputar hukum fiqih?
          </p>
          <Link
            href="/kirim-pertanyaan"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:py-2 sm:text-sm"
          >
            Kirim Pertanyaan
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {hero && (
        <div className="mt-3 sm:mt-4">
          <h2 className="relative mb-2.5 inline-block pb-1.5 font-heading text-base font-bold text-foreground sm:text-lg after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
            Artikel Unggulan
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
            <Link
              href={`/artikel/${hero.slug}`}
              className="group relative col-span-1 aspect-[16/10] overflow-hidden rounded-xl bg-muted shadow-sm transition-shadow hover:shadow-lg sm:aspect-[16/9] sm:rounded-2xl lg:col-span-2"
            >
              <Image
                src={hero.thumbnailUrl}
                alt={hero.title}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

              {hero.category && (
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs">
                  {hero.category.name}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 sm:gap-1.5 sm:p-6">
                <h3 className="line-clamp-2 font-heading text-base font-bold text-white sm:text-2xl">
                  {hero.title}
                </h3>
                <p className="line-clamp-1 text-xs text-white/80 sm:text-sm">
                  {hero.excerpt}
                </p>
                <span className="text-[11px] text-white/60 sm:text-xs">
                  {formatDate(hero.publishedAt)}
                </span>
              </div>
            </Link>

            {side && (
              <Link
                href={`/artikel/${side.slug}`}
                className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-muted shadow-sm transition-shadow hover:shadow-lg sm:aspect-[16/10] sm:rounded-2xl lg:aspect-auto lg:h-full"
              >
                <Image
                  src={side.thumbnailUrl}
                  alt={side.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                {side.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-foreground shadow-sm sm:py-1 sm:text-xs">
                    {side.category.name}
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3.5 sm:p-4">
                  <h3 className="line-clamp-2 font-heading text-sm font-bold text-white sm:text-base">
                    {side.title}
                  </h3>
                  <span className="text-[11px] text-white/60 sm:text-xs">
                    {formatDate(side.publishedAt)}
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
