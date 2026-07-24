import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, ExternalLink } from "lucide-react";

import { getPublishedEbookBySlug } from "@/db/queries/ebooks";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedEbookBySlug(slug);

  if (!item) {
    return { title: "E-Book Tidak Ditemukan" };
  }

  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      images: item.coverImageUrl ? [item.coverImageUrl] : undefined,
    },
  };
}

export default async function EbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPublishedEbookBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/e-book" className="hover:text-primary">
              E-Book
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="max-w-[16rem] truncate text-foreground" aria-current="page">
            {item.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl border border-border bg-muted">
            {item.coverImageUrl ? (
              <Image
                src={item.coverImageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <BookOpen className="size-10 text-muted-foreground" />
              </div>
            )}
          </div>

          {item.purchaseUrl ? (
            <Button
              size="lg"
              className="mt-5 w-full"
              render={
                <a href={item.purchaseUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              Beli E-Book
              <ExternalLink className="size-4" />
            </Button>
          ) : (
            <Button size="lg" className="mt-5 w-full" disabled>
              Segera Tersedia
            </Button>
          )}
        </div>

        <div className="sm:col-span-2">
          <h1 className="font-reading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {item.title}
          </h1>

          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-foreground">
            {item.description}
          </p>

          {item.previewImages.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Preview
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {item.previewImages.map((url, index) => (
                  <div
                    key={url + index}
                    className="relative aspect-3/4 overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${item.title} ${index + 1}`}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
