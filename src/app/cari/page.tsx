import type { Metadata } from "next";

import { GlobalSearch } from "@/components/search/global-search";
import { searchArticles } from "@/lib/data/articles";
import { searchQna } from "@/lib/data/qna";
import { searchAgendaDb } from "@/db/queries/agenda";
import { searchKegiatanDb } from "@/db/queries/kegiatan";
import { searchEbooksDb } from "@/db/queries/ebooks";
import { SearchResultItem } from "@/components/search/search-result-item";
import { QnaResultItem } from "@/components/search/qna-result-item";
import { AgendaResultItem } from "@/components/search/agenda-result-item";
import { KegiatanResultItem } from "@/components/search/kegiatan-result-item";
import { EbookResultItem } from "@/components/search/ebook-result-item";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return {
    title: query ? `Hasil Pencarian untuk "${query}"` : "Pencarian",
    description: query
      ? `Hasil pencarian artikel dan tanya jawab untuk kata kunci "${query}" di Markaz Fiqih.`
      : "Cari artikel dan tanya jawab di Markaz Fiqih berdasarkan judul atau isi konten.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [articleResults, qnaResults, agendaResults, kegiatanResults, ebookResults] =
    query
      ? await Promise.all([
          searchArticles(query),
          searchQna(query),
          searchAgendaDb(query),
          searchKegiatanDb(query),
          searchEbooksDb(query),
        ])
      : [[], [], [], [], []];

  const totalResults =
    articleResults.length +
    qnaResults.length +
    agendaResults.length +
    kegiatanResults.length +
    ebookResults.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Pencarian
          </h1>

          <div className="mt-5">
            <GlobalSearch showButton size="lg" initialQuery={query} />
          </div>

          <div className="mt-8 flex flex-col gap-10">
            {!query && (
              <p className="text-sm text-muted-foreground">
                Masukkan kata kunci untuk mulai mencari artikel atau tanya jawab.
              </p>
            )}

            {query && (
              <>
                <p className="text-sm text-muted-foreground">
                  {totalResults > 0
                    ? `Ditemukan ${totalResults} hasil untuk "${query}"`
                    : `Tidak ada hasil yang cocok dengan "${query}"`}
                </p>

                {articleResults.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
                      Artikel ({articleResults.length})
                    </h2>
                    <div className="flex flex-col gap-4">
                      {articleResults.map((article) => (
                        <SearchResultItem
                          key={article.slug}
                          article={article}
                          query={query}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {qnaResults.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
                      Tanya Jawab ({qnaResults.length})
                    </h2>
                    <div className="flex flex-col gap-4">
                      {qnaResults.map((qna) => (
                        <QnaResultItem key={qna.slug} qna={qna} query={query} />
                      ))}
                    </div>
                  </section>
                )}

                {agendaResults.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
                      Agenda ({agendaResults.length})
                    </h2>
                    <div className="flex flex-col gap-4">
                      {agendaResults.map((item) => (
                        <AgendaResultItem key={item.id} agenda={item} query={query} />
                      ))}
                    </div>
                  </section>
                )}

                {kegiatanResults.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
                      Kegiatan ({kegiatanResults.length})
                    </h2>
                    <div className="flex flex-col gap-4">
                      {kegiatanResults.map((item) => (
                        <KegiatanResultItem
                          key={item.slug}
                          kegiatan={item}
                          query={query}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {ebookResults.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
                      E-Book ({ebookResults.length})
                    </h2>
                    <div className="flex flex-col gap-4">
                      {ebookResults.map((ebook) => (
                        <EbookResultItem key={ebook.slug} ebook={ebook} query={query} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
