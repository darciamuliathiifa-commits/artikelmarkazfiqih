import type { Metadata } from "next";

import { getPaginatedQna } from "@/lib/data/qna";
import { getAllQnaTopics } from "@/db/queries/qna-topics";
import { GlobalSearch } from "@/components/search/global-search";
import { QnaFilterView } from "@/components/tanya-jawab/qna-filter-view";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export const metadata: Metadata = {
  title: "Tanya Jawab",
  description:
    "Kumpulan tanya jawab dan fatwa seputar Fiqih yang dijawab oleh kontributor Markaz Fiqih.",
};

export default async function QnaListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const [result, topics] = await Promise.all([
    getPaginatedQna({ page: Number(page) || 1 }),
    getAllQnaTopics(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Tanya Jawab
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Kumpulan tanya jawab dan fatwa seputar fiqih.
          </p>

          <GlobalSearch
            showButton
            placeholder="Cari tanya jawab..."
            className="max-w-lg"
          />

          <div className="mt-8">
            <QnaFilterView
              initialQna={result.items}
              initialPage={result.page}
              initialTotalPages={result.totalPages}
              topics={topics}
            />
          </div>
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
