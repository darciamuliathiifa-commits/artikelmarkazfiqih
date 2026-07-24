import { getAllCategories } from "@/db/queries/categories";
import { getAllSettings } from "@/db/queries/settings";

export type SiteChromeData = {
  categories: { name: string; slug: string }[];
  kelasUrl: string;
  footer: {
    address: string;
    tagline: string;
    youtubeUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
    whatsappUrl: string;
    email: string;
  };
};

export async function getSiteChromeData(): Promise<SiteChromeData> {
  const [categories, settings] = await Promise.all([
    getAllCategories(),
    getAllSettings(),
  ]);

  return {
    categories: categories.map((category) => ({
      name: category.name,
      slug: category.slug,
    })),
    kelasUrl: settings.kelas_url || "https://kelasmarkazfiqih.com",
    footer: {
      address: settings.address ?? "",
      tagline:
        settings.tagline_footer || "Membumikan Fiqih di Setiap Lini Kehidupan",
      youtubeUrl: settings.youtube_url ?? "",
      facebookUrl: settings.facebook_url ?? "",
      instagramUrl: settings.instagram_url ?? "",
      tiktokUrl: settings.tiktok_url ?? "",
      whatsappUrl: settings.whatsapp_url ?? "",
      email: settings.email ?? "",
    },
  };
}
