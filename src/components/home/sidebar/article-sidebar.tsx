import { TopAuthors } from "@/components/home/sidebar/top-authors";
import { FollowUs } from "@/components/home/sidebar/follow-us";
import { TrendingTopics } from "@/components/home/sidebar/trending-topics";
import { AdBanner } from "@/components/content/ad-banner";
import { StickySidebarWrapper } from "@/components/home/sidebar/sticky-sidebar-wrapper";

export function ArticleSidebar() {
  return (
    <StickySidebarWrapper>
      <TopAuthors />
      <FollowUs />
      <TrendingTopics />
      <AdBanner />
    </StickySidebarWrapper>
  );
}
