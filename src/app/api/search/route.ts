import { NextRequest, NextResponse } from "next/server";

import { searchArticlesDb } from "@/db/queries/articles";
import { searchQnaDb } from "@/db/queries/qna";
import { searchAgendaDb } from "@/db/queries/agenda";
import { searchKegiatanDb } from "@/db/queries/kegiatan";
import { searchEbooksDb } from "@/db/queries/ebooks";

const MAX_ARTICLE_RESULTS = 4;
const MAX_QNA_RESULTS = 3;
const MAX_AGENDA_RESULTS = 3;
const MAX_KEGIATAN_RESULTS = 3;
const MAX_EBOOK_RESULTS = 3;

const EMPTY_RESULTS = {
  articles: [],
  qna: [],
  agenda: [],
  kegiatan: [],
  ebooks: [],
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(EMPTY_RESULTS);
  }

  const [articles, qnaResults, agendaResults, kegiatanResults, ebookResults] =
    await Promise.all([
      searchArticlesDb(query, MAX_ARTICLE_RESULTS),
      searchQnaDb(query, MAX_QNA_RESULTS),
      searchAgendaDb(query, MAX_AGENDA_RESULTS),
      searchKegiatanDb(query, MAX_KEGIATAN_RESULTS),
      searchEbooksDb(query, MAX_EBOOK_RESULTS),
    ]);

  return NextResponse.json({
    articles: articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      categoryName: article.category.name,
    })),
    qna: qnaResults.map((item) => ({
      slug: item.slug,
      title: item.title,
    })),
    agenda: agendaResults.map((item) => ({
      id: item.id,
      title: item.title,
    })),
    kegiatan: kegiatanResults.map((item) => ({
      slug: item.slug,
      title: item.title,
    })),
    ebooks: ebookResults.map((item) => ({
      slug: item.slug,
      title: item.title,
    })),
  });
}
