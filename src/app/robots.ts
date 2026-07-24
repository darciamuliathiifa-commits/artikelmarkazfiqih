import type { MetadataRoute } from "next";

const SITE_URL = "https://markazfiqih.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/cari",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
