import { eq } from "drizzle-orm";

import { db } from "./index";
import { users, categories, articles, qna, pages, settings, tags, qnaTopics, ebooks } from "./schema";
import { slugify } from "../lib/slugify";
import {
  authors as mockAuthors,
  categories as mockCategories,
  articles as mockArticles,
  qnaList as mockQnaList,
  staticPages as mockStaticPages,
  siteInfo,
  kelasUrl,
  ebookCatalog,
} from "../lib/mock-data";

async function seed() {
  console.log("Seeding categories...");
  const categoryIdBySlug = new Map<string, string>();
  for (const category of mockCategories) {
    await db
      .insert(categories)
      .values({
        name: category.name,
        slug: category.slug,
        description: category.description,
      })
      .onConflictDoNothing({ target: categories.slug });

    const row = await db.query.categories.findFirst({
      where: eq(categories.slug, category.slug),
    });
    if (row) categoryIdBySlug.set(category.slug, row.id);
  }

  console.log("Seeding users (kontributor)...");
  const userIdBySlug = new Map<string, string>();
  for (const author of mockAuthors) {
    await db
      .insert(users)
      .values({
        name: author.name,
        email: `${author.slug}@markazfiqih.com`,
        slug: author.slug,
        role: "kontributor",
        bio: author.bio,
        longBio: author.longBio,
        avatarUrl: author.avatarUrl,
      })
      .onConflictDoNothing({ target: users.slug });

    const row = await db.query.users.findFirst({
      where: eq(users.slug, author.slug),
    });
    if (row) userIdBySlug.set(author.slug, row.id);
  }

  console.log("Seeding articles...");
  for (const article of mockArticles) {
    const categoryId = categoryIdBySlug.get(article.categorySlug);
    const authorId = userIdBySlug.get(article.authorSlug);
    if (!categoryId || !authorId) continue;

    await db
      .insert(articles)
      .values({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        thumbnailUrl: article.thumbnailUrl,
        categoryId,
        authorId,
        tags: article.tags,
        views: article.views,
        isPublished: true,
        publishedAt: new Date(article.publishedAt),
      })
      .onConflictDoNothing({ target: articles.slug });
  }

  console.log("Seeding qna...");
  for (const item of mockQnaList) {
    const answeredById = userIdBySlug.get(item.answeredBySlug);
    if (!answeredById) continue;

    await db
      .insert(qna)
      .values({
        title: item.title,
        slug: item.slug,
        question: item.question,
        answer: item.answer,
        answeredById,
        isPublished: true,
        createdAt: new Date(item.createdAt),
      })
      .onConflictDoNothing({ target: qna.slug });
  }

  console.log("Seeding tags...");
  const uniqueTagNames = Array.from(
    new Set(mockArticles.flatMap((article) => article.tags))
  );
  for (const name of uniqueTagNames) {
    await db.insert(tags).values({ name }).onConflictDoNothing({ target: tags.name });
  }

  console.log("Seeding QnA topics...");
  const defaultQnaTopics = [
    "Thaharah",
    "Shalat",
    "Zakat",
    "Puasa",
    "Haji",
    "Muamalat",
    "Nikah",
    "Jinayat",
    "Kurban",
    "Makanan",
    "Lainnya",
  ];
  for (const name of defaultQnaTopics) {
    await db
      .insert(qnaTopics)
      .values({ name, slug: slugify(name) })
      .onConflictDoNothing({ target: qnaTopics.name });
  }

  console.log("Seeding ebooks...");
  for (const item of ebookCatalog) {
    await db
      .insert(ebooks)
      .values({
        title: item.title,
        slug: slugify(item.title),
        description: `Kitab ${item.title}.`,
        purchaseUrl: item.url,
        isPublished: true,
      })
      .onConflictDoNothing({ target: ebooks.slug });
  }

  console.log("Seeding static pages...");
  for (const page of mockStaticPages) {
    await db
      .insert(pages)
      .values({
        slug: page.slug,
        title: page.title,
        content: page.content,
        updatedAt: new Date(page.updatedAt),
      })
      .onConflictDoNothing({ target: pages.slug });
  }

  console.log("Seeding settings...");
  const settingsEntries: Record<string, string> = {
    address: siteInfo.address,
    whatsapp_number: siteInfo.whatsappNumber,
    whatsapp_url: siteInfo.whatsappUrl,
    youtube_url: siteInfo.youtubeUrl,
    facebook_url: siteInfo.facebookUrl,
    instagram_url: siteInfo.instagramUrl,
    tiktok_url: siteInfo.tiktokUrl,
    email: siteInfo.email,
    kelas_url: kelasUrl,
    tagline_footer: "Membumikan Fiqih di Setiap Lini Kehidupan",
  };
  for (const [key, value] of Object.entries(settingsEntries)) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoNothing({ target: settings.key });
  }

  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
