"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { QnaListItem } from "@/lib/data/qna";
import { Pagination } from "@/components/ui/pagination";
import { QnaCard } from "@/components/tanya-jawab/qna-card";
import { Reveal } from "@/components/ui/reveal";

export function QnaFilterView({
  initialQna,
  initialTopicSlug,
  initialPage = 1,
  initialTotalPages = 1,
  topics,
}: {
  initialQna: QnaListItem[];
  initialTopicSlug?: string;
  initialPage?: number;
  initialTotalPages?: number;
  topics: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState(initialTopicSlug);
  const [items, setItems] = useState(initialQna);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();

  const basePath = (slug?: string) =>
    slug ? `/tanya-jawab/topik/${slug}` : "/tanya-jawab";

  const load = (slug: string | undefined, nextPage: number) => {
    startTransition(async () => {
      const params = new URLSearchParams();
      if (slug) params.set("topic", slug);
      if (nextPage > 1) params.set("page", String(nextPage));
      const query = params.toString();

      const response = await fetch(`/api/tanya-jawab${query ? `?${query}` : ""}`);
      const data: {
        qna: QnaListItem[];
        pagination: { page: number; totalPages: number };
      } = await response.json();
      setItems(data.qna);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    });

    const urlParams = new URLSearchParams();
    if (nextPage > 1) urlParams.set("page", String(nextPage));
    const urlQuery = urlParams.toString();
    router.replace(`${basePath(slug)}${urlQuery ? `?${urlQuery}` : ""}`, {
      scroll: false,
    });
  };

  const handleSelect = (slug?: string) => {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
    load(slug, 1);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) return;
    load(activeSlug, nextPage);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleSelect(undefined)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            !activeSlug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          Semua
        </button>
        {topics.map((topic) => (
          <button
            type="button"
            key={topic.slug}
            onClick={() => handleSelect(topic.slug)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeSlug === topic.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {topic.name}
          </button>
        ))}
      </div>

      <div
        className={`mt-6 grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 ${
          isPending ? "opacity-50" : ""
        }`}
      >
        {items.map((qna, index) => (
          <Reveal key={qna.slug} delay={Math.min(index * 60, 240)}>
            <QnaCard qna={qna} />
          </Reveal>
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          {activeSlug
            ? "Belum ada tanya jawab pada topik ini."
            : "Belum ada tanya jawab yang dipublikasikan."}
        </p>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
