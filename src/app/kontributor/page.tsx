import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { getContributorsWithCount } from "@/lib/data/authors";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export const metadata: Metadata = {
  title: "Kontributor",
  description:
    "Daftar kontributor dan penulis Markaz Fiqih beserta bio singkat masing-masing.",
};

export default async function ContributorsPage() {
  const authors = await getContributorsWithCount();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Kontributor
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Para penulis dan kontributor Markaz Fiqih.
          </p>

          {authors.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada kontributor yang ditampilkan.
            </p>
          ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {authors.map((author) => {
              const articleCount = author.articleCount;
              return (
                <Link
                  key={author.slug}
                  href={`/kontributor/${author.slug}`}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    width={80}
                    height={80}
                    className="size-20 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-heading text-base font-bold text-foreground">
                      {author.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {author.bio}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {articleCount} artikel
                  </p>
                </Link>
              );
            })}
          </div>
          )}
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
