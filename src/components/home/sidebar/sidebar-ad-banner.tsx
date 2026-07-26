import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getSettings } from "@/db/queries/settings";
import { Button } from "@/components/ui/button";

export async function SidebarAdBanner() {
  const settings = await getSettings(["ad_banner_image_url", "ad_banner_link_url"]);
  const imageUrl = settings.ad_banner_image_url;
  const linkUrl = settings.ad_banner_link_url;

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-center">
        <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Plus className="size-5" />
        </span>
        <p className="text-sm text-muted-foreground">
          Ruang banner iklan Anda
        </p>
        <Button size="sm" render={<Link href="/kontak" />}>
          Kontak
        </Button>
      </div>
    );
  }

  const banner = (
    <Image
      src={imageUrl}
      alt="Iklan"
      width={0}
      height={0}
      sizes="320px"
      className="h-auto w-full rounded-2xl border border-border object-cover"
    />
  );

  return linkUrl ? (
    <a href={linkUrl} target="_blank" rel="noopener noreferrer sponsored">
      {banner}
    </a>
  ) : (
    banner
  );
}
