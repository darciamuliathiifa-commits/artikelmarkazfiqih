import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPageBySlug } from "@/db/queries/pages";
import { getSettings } from "@/db/queries/settings";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

const SLUG = "donasi";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return { title: page?.title ?? "Donasi" };
}

export default async function DonasiPage() {
  const [page, settings] = await Promise.all([
    getPageBySlug(SLUG),
    getSettings(["whatsapp_url"]),
  ]);
  if (!page) notFound();

  const whatsappUrl = settings.whatsapp_url || "https://wa.me/6285752607520";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="max-w-3xl">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {page.title}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Terakhir diperbarui: {formatDate(page.updatedAt.toISOString())}
        </p>
        <div
          className="article-content mt-6"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
        <Button
          size="lg"
          className="mt-2"
          render={
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />
          }
        >
          Hubungi Admin via WhatsApp
        </Button>
      </div>
    </div>
  );
}
