import { TopAuthors } from "@/components/home/sidebar/top-authors";
import { FollowUs } from "@/components/home/sidebar/follow-us";
import { TrendingTopics } from "@/components/home/sidebar/trending-topics";
import { SidebarAdBanner } from "@/components/home/sidebar/sidebar-ad-banner";

/**
 * Sidebar widgets shown on mobile below Agenda & Kegiatan sections.
 * Hidden on desktop (desktop shows them in the BreakingNews aside instead).
 */
export async function MobileSidebarWidgets() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-10 lg:hidden">
      <div className="flex flex-col gap-8">
        <TopAuthors />
        <FollowUs />
        <TrendingTopics />
        <SidebarAdBanner />
      </div>
    </div>
  );
}
