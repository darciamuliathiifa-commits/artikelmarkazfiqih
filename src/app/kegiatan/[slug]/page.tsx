import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";

import { getPublishedKegiatanBySlug } from "@/db/queries/kegiatan";
import { formatDate } from "@/lib/format";
import { extractToc } from "@/lib/toc";
import { extractFootnotes } from "@/lib/footnotes";
import { breadcrumbSchema } from "@/lib/schema";
import { ShareButtons } from "@/components/article/share-buttons";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

const FALLBACK_THUMBNAIL = "/images/banner-pattern.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedKegiatanBySlug(slug);

  if (!item) {
    return { title: "Kegiatan Tidak Ditemukan" };
  }

  return {
    title: item.title,
    description: item.excerpt,
    openGraph: {
      title: item.title,
      description: item.excerpt,
      type: "article",
      images: item.thumbnailUrl ? [item.thumbnailUrl] : undefined,
    },
  };
}

export default async function KegiatanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPublishedKegiatanBySlug(slug);

  if (!item) {
    notFound();
  }

  const { html: contentWithoutFootnotes, footnotes } = extractFootnotes(item.content);
  const { html, toc } = extractToc(contentWithoutFootnotes);

  const headersList = await headers();
  const host = headersList.get("host") ?? "markazfiqih.com";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const kegiatanUrl = `${origin}/kegiatan/${item.slug}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <article className="lg:col-span-2">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbSchema([
                { name: "Home", url: origin },
                { name: "Kegiatan", url: `${origin}/kegiatan` },
                { name: item.title, url: kegiatanUrl },
              ])
            ),
          }}
        />

        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/kegiatan" className="hover:text-primary">
                Kegiatan
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="max-w-[16rem] truncate text-foreground" aria-current="page">
              {item.title}
            </li>
          </ol>
        </nav>

        <h1 className="font-reading text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
          {item.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
          {item.eventDate ? (
            <span className="text-sm text-muted-foreground">
              {formatDate(item.eventDate.toISOString())}
            </span>
          ) : (
            <span />
          )}
          <ShareButtons title={item.title} url={kegiatanUrl} />
        </div>

        <div className="relative mt-6 aspect-16/9 w-full overflow-hidden bg-muted">
          <Image
            src={item.thumbnailUrl || FALLBACK_THUMBNAIL}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {toc.length > 1 && (
          <nav
            aria-label="Daftar isi"
            className="mt-8 border-l-2 border-primary/30 py-1 pl-4"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Daftar Isi
            </p>
            <ol className="flex flex-col gap-1.5 text-sm">
              {toc.map((tocItem, index) => (
                <li key={tocItem.id}>
                  <a
                    href={`#${tocItem.id}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {index + 1}. {tocItem.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className="article-content mt-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {footnotes.length > 0 && (
          <div className="footnotes-section">
            <p className="font-heading text-xs font-semibold uppercase tracking-wide text-foreground">
              Catatan Kaki
            </p>
            <ol>
              {footnotes.map((footnote, index) => (
                <li key={footnote.id} id={footnote.id}>
                  {footnote.text}
                  <a href={`#fnref-${index + 1}`} aria-label="Kembali ke teks">
                    &#8617;
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </article>

      <ArticleSidebar />
    </div>
    </div>
  );
}
