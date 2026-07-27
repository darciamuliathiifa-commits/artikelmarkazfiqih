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
  let categories: { name: string; slug: string }[] = [];
  let settings: Record<string, string> = {};

  try {
    const [cats, setts] = await Promise.all([
      getAllCategories(),
      getAllSettings(),
    ]);
    categories = cats.map((category) => ({
      name: category.name,
      slug: category.slug,
    }));
    settings = setts;
  } catch (err) {
    console.warn("DB not connected locally, using fallback chrome data.");
    categories = [
      { name: "Fiqih Ibadah", slug: "fiqih-ibadah" },
      { name: "Fiqih Muamalah", slug: "fiqih-muamalah" },
      { name: "Fiqih Munakahat", slug: "fiqih-munakahat" },
    ];
  }

  return {
    categories,
    kelasUrl: settings.kelas_url || "https://kelasmarkazfiqih.com",
    footer: {
      address: settings.address ?? "Jakarta, Indonesia",
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
