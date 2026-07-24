import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { getPublishedEbooks } from "@/db/queries/ebooks";

export const metadata: Metadata = {
  title: "E-Book",
  description:
    "Katalog e-book dan kitab kuning dari para pengajar Markaz Fiqih.",
};

export default async function EbookPage() {
  const items = await getPublishedEbooks();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="max-w-3xl">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          E-Book
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Katalog e-book Markaz Fiqih.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 max-w-3xl rounded-xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
          Katalog e-book akan segera hadir.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/e-book/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
                {item.coverImageUrl ? (
                  <Image
                    src={item.coverImageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="size-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 items-start gap-2 p-3">
                <span className="line-clamp-2 flex-1 font-heading text-sm font-semibold text-foreground group-hover:text-primary">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
