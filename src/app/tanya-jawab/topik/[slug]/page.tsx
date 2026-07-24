import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getAllQnaTopics, getQnaTopicBySlug } from "@/db/queries/qna-topics";
import { getPaginatedQna } from "@/lib/data/qna";
import { GlobalSearch } from "@/components/search/global-search";
import { QnaFilterView } from "@/components/tanya-jawab/qna-filter-view";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getQnaTopicBySlug(slug);

  if (!topic) {
    return { title: "Topik Tidak Ditemukan" };
  }

  return {
    title: `Tanya Jawab ${topic.name}`,
    description: `Kumpulan tanya jawab seputar ${topic.name} dari Markaz Fiqih.`,
  };
}

export default async function TopicQnaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const topic = await getQnaTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const [result, allTopics] = await Promise.all([
    getPaginatedQna({ topicSlug: topic.slug, page: Number(page) || 1 }),
    getAllQnaTopics(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Tanya Jawab {topic.name}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {result.totalCount} tanya jawab
          </p>

          <GlobalSearch
            showButton
            placeholder="Cari tanya jawab..."
            className="max-w-lg"
          />

          <div className="mt-8">
            <QnaFilterView
              initialQna={result.items}
              initialTopicSlug={topic.slug}
              initialPage={result.page}
              initialTotalPages={result.totalPages}
              topics={allTopics}
            />
          </div>
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
