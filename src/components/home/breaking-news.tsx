import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getLatestArticles } from "@/lib/data/articles";
import { BreakingNewsList } from "@/components/home/breaking-news-list";
import { TopAuthors } from "@/components/home/sidebar/top-authors";
import { FollowUs } from "@/components/home/sidebar/follow-us";
import { TrendingTopics } from "@/components/home/sidebar/trending-topics";
import { SidebarAdBanner } from "@/components/home/sidebar/sidebar-ad-banner";

export async function BreakingNews() {
  const articles = await getLatestArticles(4);

  if (articles.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-3">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-heading text-lg font-bold text-foreground">
          # Artikel Terbaru
        </h2>
        <Link
          href="/artikel"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Lihat Semua
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BreakingNewsList articles={articles} />
        </div>

        <aside className="hidden lg:flex lg:flex-col lg:gap-8">
          <TopAuthors />
          <FollowUs />
          <TrendingTopics />
          <SidebarAdBanner />
        </aside>
      </div>
    </section>
  );
}
