import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { Globe } from "lucide-react";

import { getAuthorBySlug, getArticlesByAuthor } from "@/lib/data/authors";
import { AuthorArticlesList } from "@/components/author/author-articles-list";
import { ShareButtons } from "@/components/article/share-buttons";
import { personSchema, breadcrumbSchema } from "@/lib/schema";
import { FacebookIcon } from "@/components/icons/social-icons";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { title: "Kontributor Tidak Ditemukan" };
  }

  return {
    title: author.name,
    description: author.bio,
    openGraph: {
      title: author.name,
      description: author.bio,
      type: "profile",
      images: [author.avatarUrl],
    },
    twitter: {
      card: "summary",
      title: author.name,
      description: author.bio,
      images: [author.avatarUrl],
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const articles = await getArticlesByAuthor(author.slug);

  const headersList = await headers();
  const host = headersList.get("host") ?? "markazfiqih.com";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const profileUrl = `${origin}/kontributor/${author.slug}`;

  const socials = [
    { label: "Website", href: author.websiteUrl, icon: Globe },
    { label: "Facebook", href: author.facebookUrl, icon: FacebookIcon },
  ].filter((social) => social.href);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            personSchema({
              name: author.name,
              description: author.bio || null,
              url: profileUrl,
              imageUrl: author.avatarUrl.startsWith("http")
                ? author.avatarUrl
                : `${origin}${author.avatarUrl}`,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: origin },
              { name: "Kontributor", url: `${origin}/kontributor` },
              { name: author.name, url: profileUrl },
            ])
          ),
        }}
      />
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <Image
          src={author.avatarUrl}
          alt={author.name}
          width={112}
          height={112}
          className="size-28 shrink-0 rounded-full object-cover"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {author.name}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {author.longBio}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {articles.length} artikel dipublikasikan
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <ShareButtons title={`Profil ${author.name}`} url={profileUrl} />

            {socials.length > 0 && (
              <div className="flex items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-5 font-heading text-xl font-bold text-foreground">
          Tulisan dari {author.name}
        </h2>

        {articles.length > 0 ? (
          <AuthorArticlesList articles={articles} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Belum ada artikel yang dipublikasikan.
          </p>
        )}
      </div>
      </div>

      <ArticleSidebar />
      </div>
    </div>
  );
}
