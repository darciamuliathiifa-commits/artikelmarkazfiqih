import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { getFeaturedArticles, getLatestArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";

export async function HeroMagazine() {
  const featured = await getFeaturedArticles(2);
  const articles = featured.length >= 2 ? featured : await getLatestArticles(2);

  const [hero, side] = articles;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-5 pb-8 sm:pt-6">
      <div className="grid grid-cols-1 items-center gap-4 border-b border-border pb-4 text-center lg:grid-cols-3 lg:gap-4 lg:text-left">
        <h1 className="min-w-0 font-heading text-2xl font-extrabold leading-snug tracking-tight text-foreground sm:text-3xl lg:col-span-2 lg:text-3xl lg:leading-[1.3]">
          Pusat Rujukan Fiqih
          <br />
          Berlandaskan Madzhab Syafi&apos;i
        </h1>
        <div className="flex flex-col items-center gap-3 sm:max-w-xs lg:col-span-1 lg:items-start">
          <p className="text-sm text-muted-foreground">
            Punya pertanyaan seputar hukum fiqih?
          </p>
          <Link
            href="/kirim-pertanyaan"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Kirim Pertanyaan
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {hero && (
        <div className="mt-4">
          <h2 className="relative mb-3 inline-block pb-2 font-heading text-lg font-bold text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
            Artikel Unggulan
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Link
              href={`/artikel/${hero.slug}`}
              className="group relative col-span-1 aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm transition-shadow hover:shadow-lg sm:aspect-[16/9] lg:col-span-2"
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
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                  {hero.category.name}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 sm:p-6">
                <h3 className="line-clamp-2 font-heading text-xl font-bold text-white sm:text-2xl">
                  {hero.title}
                </h3>
                <p className="line-clamp-1 text-sm text-white/75">
                  {hero.excerpt}
                </p>
                <span className="text-xs text-white/60">
                  {formatDate(hero.publishedAt)}
                </span>
              </div>
            </Link>

            {side && (
              <Link
                href={`/artikel/${side.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm transition-shadow hover:shadow-lg sm:aspect-[16/10] lg:aspect-auto lg:h-full"
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
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {side.category.name}
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
                  <h3 className="line-clamp-2 font-heading text-base font-bold text-white">
                    {side.title}
                  </h3>
                  <span className="text-xs text-white/60">
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
