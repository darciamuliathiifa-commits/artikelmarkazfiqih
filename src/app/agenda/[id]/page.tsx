import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, User, ExternalLink } from "lucide-react";

import { getPublishedAgendaById } from "@/db/queries/agenda";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getPublishedAgendaById(id);

  if (!item) {
    return { title: "Agenda Tidak Ditemukan" };
  }

  return {
    title: item.title,
    description: item.description ?? undefined,
  };
}

export default async function AgendaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPublishedAgendaById(id);

  if (!item) {
    notFound();
  }

  const embedUrl = item.linkUrl ? getYoutubeEmbedUrl(item.linkUrl) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <article className="lg:col-span-2">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/agenda" className="hover:text-primary">
                Agenda
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

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 shrink-0" />
            {item.scheduleText}
          </span>
          {item.pengajar && (
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 shrink-0" />
              {item.pengajar}
            </span>
          )}
        </div>

        {embedUrl ? (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <iframe
              src={embedUrl}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          </div>
        ) : (
          item.imageUrl && (
            <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )
        )}

        {item.description && (
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-foreground">
            {item.description}
          </p>
        )}

        {item.linkUrl && (
          <Button
            className="mt-6 w-fit"
            render={<a href={item.linkUrl} target="_blank" rel="noopener noreferrer" />}
          >
            {embedUrl ? "Tonton di YouTube" : "Info Lebih Lanjut"}
            <ExternalLink className="size-3.5" />
          </Button>
        )}
      </article>

      <ArticleSidebar />
    </div>
    </div>
  );
}
