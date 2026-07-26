import type { Metadata } from "next";

import { getSettings } from "@/db/queries/settings";
import { ExternalLinksForm } from "@/components/admin/external-links-form";

export const metadata: Metadata = {
  title: "Tautan Eksternal",
  robots: { index: false, follow: false },
};

export default async function AdminExternalLinksPage() {
  const settings = await getSettings([
    "kelas_url",
    "ad_banner_image_url",
    "ad_banner_link_url",
    "ad_banner_1_image_url",
    "ad_banner_1_link_url",
    "ad_banner_2_image_url",
    "ad_banner_2_link_url",
    "ad_banner_3_image_url",
    "ad_banner_3_link_url",
    "address",
    "whatsapp_number",
    "whatsapp_url",
    "email",
    "youtube_url",
    "facebook_url",
    "instagram_url",
    "tiktok_url",
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
        Tautan Eksternal
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Atur URL menu Kelas, banner iklan, info kontak, dan tautan media
        sosial yang tampil di situs. Katalog E-Book dikelola di menu
        tersendiri.
      </p>

      <ExternalLinksForm
        initialKelasUrl={settings.kelas_url ?? ""}
        initialAdBanner1ImageUrl={
          settings.ad_banner_1_image_url ?? settings.ad_banner_image_url ?? ""
        }
        initialAdBanner1LinkUrl={
          settings.ad_banner_1_link_url ?? settings.ad_banner_link_url ?? ""
        }
        initialAdBanner2ImageUrl={settings.ad_banner_2_image_url ?? ""}
        initialAdBanner2LinkUrl={settings.ad_banner_2_link_url ?? ""}
        initialAdBanner3ImageUrl={settings.ad_banner_3_image_url ?? ""}
        initialAdBanner3LinkUrl={settings.ad_banner_3_link_url ?? ""}
        initialAddress={settings.address ?? ""}
        initialWhatsappNumber={settings.whatsapp_number ?? ""}
        initialWhatsappUrl={settings.whatsapp_url ?? ""}
        initialEmail={settings.email ?? ""}
        initialYoutubeUrl={settings.youtube_url ?? ""}
        initialFacebookUrl={settings.facebook_url ?? ""}
        initialInstagramUrl={settings.instagram_url ?? ""}
        initialTiktokUrl={settings.tiktok_url ?? ""}
      />
    </div>
  );
}
