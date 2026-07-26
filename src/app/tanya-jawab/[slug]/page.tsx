import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";

import { getQnaDetail, getRelatedQna } from "@/lib/data/qna";
import { formatDate } from "@/lib/format";
import { extractFootnotes } from "@/lib/footnotes";
import { AuthorCard } from "@/components/article/author-card";
import { ShareButtons } from "@/components/article/share-buttons";
import { Badge } from "@/components/ui/badge";
import { breadcrumbSchema, qaSchema } from "@/lib/schema";
import { QnaCard } from "@/components/tanya-jawab/qna-card";
import { getApprovedCommentsByQnaSlug } from "@/db/queries/comments";
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
  const qna = await getQnaDetail(slug);

  if (!qna) {
    return { title: "Tanya Jawab Tidak Ditemukan" };
  }

  return {
    title: qna.title,
    description: qna.question,
    openGraph: {
      title: qna.title,
      description: qna.question,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: qna.title,
      description: qna.question,
    },
  };
}

export default async function QnaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const qna = await getQnaDetail(slug);

  if (!qna) {
    notFound();
  }

  const answeredBy = qna.answeredByProfile;
  const topic = qna.topic;
  const relatedQna = await getRelatedQna(topic?.slug ?? null, qna.slug, 3);
  const { html: answerHtml, footnotes } = extractFootnotes(qna.answer);
  const commentRows = await getApprovedCommentsByQnaSlug(qna.slug);
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
  const qnaUrl = `${origin}/tanya-jawab/${qna.slug}`;

  const breadcrumbItems = [
    { name: "Home", url: origin },
    { name: "Tanya Jawab", url: `${origin}/tanya-jawab` },
    { name: qna.title, url: qnaUrl },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <article className="lg:col-span-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            qaSchema({
              question: qna.question,
              answer: qna.answer,
              url: qnaUrl,
              authorName: answeredBy?.name ?? "Markaz Fiqih",
            })
          ),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/tanya-jawab" className="hover:text-primary">
              Tanya Jawab
            </Link>
          </li>
          {topic && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/tanya-jawab/topik/${topic.slug}`}
                  className="hover:text-primary"
                >
                  {topic.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="max-w-[16rem] truncate text-foreground" aria-current="page">
            {qna.title}
          </li>
        </ol>
      </nav>

      {topic && (
        <Badge className="bg-primary text-primary-foreground">
          {topic.name}
        </Badge>
      )}

      <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        {qna.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {answeredBy && (
          <Link
            href={`/kontributor/${answeredBy.slug}`}
            className="font-medium text-foreground hover:text-primary"
          >
            Dijawab oleh {answeredBy.name}
          </Link>
        )}
        <span>{formatDate(qna.createdAt)}</span>
      </div>

      <div className="mt-4">
        <ShareButtons title={qna.title} url={qnaUrl} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5">
        <p className="mb-2 font-heading text-sm font-semibold text-foreground">
          Pertanyaan:
        </p>
        <p className="text-lg leading-relaxed text-foreground">
          {qna.question}
        </p>
      </div>

      <div className="article-content mt-6">
        <h2>Jawaban:</h2>
        <div dangerouslySetInnerHTML={{ __html: answerHtml }} />
      </div>

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

      {answeredBy && <AuthorCard author={answeredBy} />}

      {relatedQna.length > 0 && (
        <div className="mt-10 border-t border-border pt-8">
          <h2 className="relative inline-block pb-2 font-heading text-lg font-bold text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
            Tanya Jawab Terkait
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedQna.map((related, index) => (
              <Reveal key={related.slug} delay={Math.min(index * 60, 240)}>
                <QnaCard qna={related} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <CommentSection comments={publicComments} qnaSlug={qna.slug} />

      <div className="mt-10 lg:hidden">
        <AdBanner />
      </div>
    </article>

    <ArticleSidebar />
    </div>
    </div>
  );
}
