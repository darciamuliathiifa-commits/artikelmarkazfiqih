import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Eye } from "lucide-react";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  getArticleBySlug,
  getOtherArticlesByAuthor,
  getRelatedArticles,
} from "@/lib/data/articles";
import { estimateReadingTime, formatDate, formatViews } from "@/lib/format";
import { extractToc } from "@/lib/toc";
import { extractFootnotes } from "@/lib/footnotes";
import { AuthorCard } from "@/components/article/author-card";
import { AuthorOtherArticles } from "@/components/article/author-other-articles";
import { ShareButtons } from "@/components/article/share-buttons";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { ViewTracker } from "@/components/article/view-tracker";
import { ArticleCard } from "@/components/home/article-card";
import { getApprovedCommentsByArticleSlug } from "@/db/queries/comments";
import { CommentSection } from "@/components/comments/comment-section";
import { AdBanner } from "@/components/content/ad-banner";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";
import { Reveal } from "@/components/ui/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  return {
    title: article.title,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      images: [article.thumbnailUrl],
      publishedTime: article.publishedAt,
      authors: article.authorProfile ? [article.authorProfile.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
      images: [article.thumbnailUrl],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const author = article.authorProfile;
  const category = article.category;
  const { html: contentWithoutFootnotes, footnotes } = extractFootnotes(
    article.content
  );
  const { html, toc } = extractToc(contentWithoutFootnotes);
  const readingTime = estimateReadingTime(article.content);
  const otherArticles = author
    ? await getOtherArticlesByAuthor(author.slug, article.slug, 4)
    : [];
  const relatedArticles = await getRelatedArticles(
    category?.slug ?? null,
    article.slug,
    3
  );
  const commentRows = await getApprovedCommentsByArticleSlug(article.slug);
  const publicComments = commentRows.map((row) => ({
    id: row.id,
    name: row.name,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  }));

  const headersList = await headers();
  const host = headersList.get("host") ?? "markazfiqih.com";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const articleUrl = `${origin}/artikel/${article.slug}`;

  const breadcrumbItems = [
    { name: "Home", url: origin },
    ...(category
      ? [
          {
            name: category.name,
            url: `${origin}/artikel/kategori/${category.slug}`,
          },
        ]
      : []),
    { name: article.title, url: articleUrl },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <article className="lg:col-span-2">
      <ViewTracker slug={article.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: article.title,
              description: article.metaDescription,
              url: articleUrl,
              thumbnailUrl: article.thumbnailUrl.startsWith("http")
                ? article.thumbnailUrl
                : `${origin}${article.thumbnailUrl}`,
              authorName: author?.name ?? "Markaz Fiqih",
              publishedAt: article.publishedAt,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(breadcrumbItems)),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/artikel/kategori/${category.slug}`}
                  className="hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="max-w-[16rem] truncate text-foreground" aria-current="page">
            {article.title}
          </li>
        </ol>
      </nav>

      {category && (
        <Link
          href={`/artikel/kategori/${category.slug}`}
          className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
        >
          {category.name}
        </Link>
      )}

      <h1 className="mt-3 font-reading text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="mt-4 font-reading text-lg leading-snug text-muted-foreground sm:text-xl">
          {article.excerpt}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
        {author ? (
          <Link
            href={`/kontributor/${author.slug}`}
            className="flex items-center gap-3"
          >
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-full object-cover"
            />
            <span className="flex flex-col">
              <span className="font-medium text-foreground hover:text-primary">
                {author.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(article.publishedAt)} · {readingTime} menit baca
              </span>
            </span>
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">
            {formatDate(article.publishedAt)} · {readingTime} menit baca
          </span>
        )}

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="size-3.5" />
            {formatViews(article.views)}
          </span>
          <ShareButtons title={article.title} url={articleUrl} />
        </div>
      </div>

      <div className="relative mt-6 aspect-16/9 w-full overflow-hidden bg-muted">
        <Image
          src={article.thumbnailUrl}
          alt={article.title}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {toc.length > 1 && (
        <nav
          aria-label="Daftar isi"
          className="mt-8 border-l-2 border-primary/30 py-1 pl-4"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Daftar Isi
          </p>
          <ol className="flex flex-col gap-1.5 text-sm">
            {toc.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {index + 1}. {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div
        className="article-content mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {footnotes.length > 0 && (
        <div className="footnotes-section">
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-foreground">
            Catatan Kaki
          </p>
          <ol>
            {footnotes.map((footnote, index) => (
              <li key={footnote.id} id={footnote.id}>
                {footnote.text}
                <a href={`#fnref-${index + 1}`} aria-label="Kembali ke teks">
                  &#8617;
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {author && (
        <>
          <AuthorCard author={author} />
          <AuthorOtherArticles author={author} articles={otherArticles} />
        </>
      )}

      {relatedArticles.length > 0 && (
        <div className="mt-10 border-t border-border pt-8">
          <h2 className="relative inline-block pb-2 font-heading text-lg font-bold text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
            Artikel Terkait
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {relatedArticles.map((related, index) => (
              <Reveal key={related.slug} delay={Math.min(index * 60, 240)}>
                <ArticleCard article={related} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <CommentSection comments={publicComments} articleSlug={article.slug} />

      <div className="mt-10 lg:hidden">
        <AdBanner />
      </div>
    </article>

    <ArticleSidebar />
    </div>
    </div>
  );
}
