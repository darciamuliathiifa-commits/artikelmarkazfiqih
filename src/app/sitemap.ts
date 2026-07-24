import type { MetadataRoute } from "next";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categories, users, qna, qnaTopics } from "@/db/schema";
import { getPublishedArticlesForSitemap } from "@/db/queries/articles";
import { getPublishedKegiatanForSitemap } from "@/db/queries/kegiatan";
import { getPublishedEbooksForSitemap } from "@/db/queries/ebooks";

const SITE_URL = "https://markazfiqih.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dbArticles, dbCategories, dbAuthors, dbQna, dbKegiatan, dbQnaTopics, dbEbooks] =
    await Promise.all([
      getPublishedArticlesForSitemap(),
      db.select({ slug: categories.slug }).from(categories),
      db
        .select({ slug: users.slug })
        .from(users)
        .where(eq(users.role, "kontributor")),
      db
        .select({ slug: qna.slug, updatedAt: qna.updatedAt })
        .from(qna)
        .where(eq(qna.isPublished, true)),
      getPublishedKegiatanForSitemap(),
      db.select({ slug: qnaTopics.slug }).from(qnaTopics),
      getPublishedEbooksForSitemap(),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/artikel`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/tanya-jawab`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/agenda`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/kegiatan`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/e-book`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/kontributor`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/kirim-pertanyaan`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/tentang-kami`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/donasi`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/kontak`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/kebijakan-privasi`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = dbCategories.map((category) => ({
    url: `${SITE_URL}/artikel/kategori/${category.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const qnaTopicRoutes: MetadataRoute.Sitemap = dbQnaTopics.map((topic) => ({
    url: `${SITE_URL}/tanya-jawab/topik/${topic.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const articleRoutes: MetadataRoute.Sitemap = dbArticles.map((article) => ({
    url: `${SITE_URL}/artikel/${article.slug}`,
    lastModified: article.updatedAt ?? article.publishedAt ?? undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const qnaRoutes: MetadataRoute.Sitemap = dbQna.map((item) => ({
    url: `${SITE_URL}/tanya-jawab/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const kegiatanRoutes: MetadataRoute.Sitemap = dbKegiatan.map((item) => ({
    url: `${SITE_URL}/kegiatan/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const authorRoutes: MetadataRoute.Sitemap = dbAuthors.map((author) => ({
    url: `${SITE_URL}/kontributor/${author.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const ebookRoutes: MetadataRoute.Sitemap = dbEbooks.map((item) => ({
    url: `${SITE_URL}/e-book/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...qnaTopicRoutes,
    ...articleRoutes,
    ...qnaRoutes,
    ...kegiatanRoutes,
    ...authorRoutes,
    ...ebookRoutes,
  ];
}
