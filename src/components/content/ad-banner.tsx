import Image from "next/image";

import { getSettings } from "@/db/queries/settings";

const SLOT_LABELS = ["Rekomendasi", "Informasi", "Iklan"] as const;

export async function AdBanner() {
  const settings = await getSettings([
    "ad_banner_1_image_url",
    "ad_banner_1_link_url",
    "ad_banner_2_image_url",
    "ad_banner_2_link_url",
    "ad_banner_3_image_url",
    "ad_banner_3_link_url",
    "ad_banner_image_url",
    "ad_banner_link_url",
  ]);

  const slots: { imageUrl?: string; linkUrl?: string }[] = [
    {
      imageUrl: settings.ad_banner_1_image_url || settings.ad_banner_image_url,
      linkUrl: settings.ad_banner_1_link_url || settings.ad_banner_link_url,
    },
    {
      imageUrl: settings.ad_banner_2_image_url,
      linkUrl: settings.ad_banner_2_link_url,
    },
    {
      imageUrl: settings.ad_banner_3_image_url,
      linkUrl: settings.ad_banner_3_link_url,
    },
  ];

  const banners = slots
    .map((slot, index) => ({ ...slot, label: SLOT_LABELS[index] }))
    .filter(
      (
        slot
      ): slot is typeof slot & { imageUrl: string } => Boolean(slot.imageUrl)
    );

  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {banners.map((banner) => {
        const image = (
          <Image
            src={banner.imageUrl}
            alt="Iklan"
            width={0}
            height={0}
            sizes="320px"
            className="h-auto w-full rounded-2xl border border-border object-cover"
          />
        );

        return (
          <div key={banner.label}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {banner.label}
            </h2>
            {banner.linkUrl ? (
              <a
                href={banner.linkUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                {image}
              </a>
            ) : (
              image
            )}
          </div>
        );
      })}
    </div>
  );
}
