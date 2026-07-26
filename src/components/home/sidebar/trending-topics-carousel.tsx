"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FALLBACK_THUMBNAIL = "/images/banner-pattern.webp";

type TrendingCategory = {
  name: string;
  slug: string;
  articleCount: number;
  thumbnailUrl: string | null;
};

export function TrendingTopicsCarousel({
  categories,
}: {
  categories: TrendingCategory[];
}) {
  const [index, setIndex] = useState(0);
  const active = categories[index];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted">
      <Link
        href={`/artikel/kategori/${active.slug}`}
        className="group relative block aspect-[16/10] w-full"
      >
        <Image
          src={active.thumbnailUrl || FALLBACK_THUMBNAIL}
          alt={active.name}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-heading text-base font-bold text-white">
            {active.name}
          </p>
          <p className="text-xs text-white/70">
            {active.articleCount} artikel
          </p>
        </div>
      </Link>

      {categories.length > 1 && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Kategori sebelumnya"
            onClick={() =>
              setIndex((current) => (current - 1 + categories.length) % categories.length)
            }
            className="flex size-7 items-center justify-center rounded-full bg-white/90 text-foreground transition-colors hover:bg-white"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Kategori berikutnya"
            onClick={() => setIndex((current) => (current + 1) % categories.length)}
            className="flex size-7 items-center justify-center rounded-full bg-white/90 text-foreground transition-colors hover:bg-white"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
