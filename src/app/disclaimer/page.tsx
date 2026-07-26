import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPageBySlug } from "@/db/queries/pages";
import { StaticPageLayout } from "@/components/static-page/static-page-layout";

const SLUG = "disclaimer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return { title: page?.title ?? "Disclaimer" };
}

export default async function DisclaimerPage() {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  return (
    <StaticPageLayout
      title={page.title}
      updatedAt={page.updatedAt.toISOString()}
      content={page.content}
    />
  );
}
