import { HeroMagazine } from "@/components/home/hero-magazine";
import { BreakingNews } from "@/components/home/breaking-news";
import { LatestAgenda } from "@/components/home/latest-agenda";
import { LatestKegiatan } from "@/components/home/latest-kegiatan";
import { LatestQna } from "@/components/home/latest-qna";
import { MobileSidebarWidgets } from "@/components/home/mobile-sidebar-widgets";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroMagazine />
      <BreakingNews />
      <LatestAgenda />
      <LatestKegiatan />
      <LatestQna />
      <MobileSidebarWidgets />
    </div>
  );
}
