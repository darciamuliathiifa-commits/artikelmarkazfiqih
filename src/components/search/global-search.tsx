"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchSuggestions = {
  articles: { slug: string; title: string; categoryName: string | null }[];
  qna: { slug: string; title: string }[];
  agenda: { id: string; title: string }[];
  kegiatan: { slug: string; title: string }[];
  ebooks: { slug: string; title: string }[];
};

const EMPTY_SUGGESTIONS: SearchSuggestions = {
  articles: [],
  qna: [],
  agenda: [],
  kegiatan: [],
  ebooks: [],
};
const DEBOUNCE_MS = 250;

export function GlobalSearch({
  className,
  inputClassName,
  placeholder = "Cari artikel atau tanya jawab...",
  onNavigate,
  showButton = false,
  size = "default",
  initialQuery = "",
  variant = "default",
}: {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onNavigate?: () => void;
  showButton?: boolean;
  size?: "default" | "lg";
  initialQuery?: string;
  variant?: "default" | "inverted";
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestions>(EMPTY_SUGGESTIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const keyword = query.trim();
    if (!keyword) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(keyword)}`,
          { signal: controller.signal }
        );
        const data: SearchSuggestions = await response.json();
        setSuggestions(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSuggestions(EMPTY_SUGGESTIONS);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const hasSuggestions =
    suggestions.articles.length > 0 ||
    suggestions.qna.length > 0 ||
    suggestions.agenda.length > 0 ||
    suggestions.kegiatan.length > 0 ||
    suggestions.ebooks.length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/cari?q=${encodeURIComponent(trimmed)}`);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          goToSearch(query);
        }}
        className={showButton ? "flex items-center gap-2" : undefined}
      >
        <div className="relative flex-1">
          <Search
            className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 ${
              variant === "inverted" ? "text-muted-foreground/70" : "text-muted-foreground"
            } ${size === "lg" ? "left-3 size-4" : "size-4"}`}
          />
          <Input
            name="q"
            type="search"
            aria-label="Cari artikel atau tanya jawab"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className={`pl-8 ${size === "lg" ? "h-11 pl-9" : ""} ${
              variant === "inverted"
                ? "border-transparent bg-white text-foreground shadow-sm focus-visible:ring-[var(--color-gold)]/50"
                : ""
            } ${inputClassName ?? ""}`}
            autoComplete="off"
          />
        </div>
        {showButton && (
          <Button
            type="submit"
            size={size === "lg" ? "lg" : "default"}
            className={`${size === "lg" ? "h-11" : ""} ${
              variant === "inverted"
                ? "bg-white text-primary hover:bg-white/90"
                : ""
            }`}
          >
            Cari
          </Button>
        )}
      </form>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-96 overflow-y-auto rounded-xl border border-border bg-popover text-popover-foreground shadow-md">
          {loading ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              Mencari...
            </p>
          ) : hasSuggestions ? (
            <>
              {suggestions.articles.length > 0 && (
                <ul className="flex flex-col divide-y divide-border">
                  {suggestions.articles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/artikel/${article.slug}`}
                        onClick={() => {
                          setOpen(false);
                          onNavigate?.();
                        }}
                        className="flex flex-col gap-0.5 px-3 py-2.5 text-sm hover:bg-muted"
                      >
                        <span className="font-medium text-foreground">
                          {article.title}
                        </span>
                        {article.categoryName && (
                          <span className="text-xs text-muted-foreground">
                            {article.categoryName}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {suggestions.qna.length > 0 && (
                <>
                  <p className="border-t border-border px-3 pt-2.5 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tanya Jawab
                  </p>
                  <ul className="flex flex-col divide-y divide-border">
                    {suggestions.qna.map((qna) => (
                      <li key={qna.slug}>
                        <Link
                          href={`/tanya-jawab/${qna.slug}`}
                          onClick={() => {
                            setOpen(false);
                            onNavigate?.();
                          }}
                          className="flex flex-col gap-0.5 px-3 py-2.5 text-sm hover:bg-muted"
                        >
                          <span className="font-medium text-foreground">
                            {qna.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {suggestions.agenda.length > 0 && (
                <>
                  <p className="border-t border-border px-3 pt-2.5 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Agenda
                  </p>
                  <ul className="flex flex-col divide-y divide-border">
                    {suggestions.agenda.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/agenda/${item.id}`}
                          onClick={() => {
                            setOpen(false);
                            onNavigate?.();
                          }}
                          className="flex flex-col gap-0.5 px-3 py-2.5 text-sm hover:bg-muted"
                        >
                          <span className="font-medium text-foreground">
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {suggestions.kegiatan.length > 0 && (
                <>
                  <p className="border-t border-border px-3 pt-2.5 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Kegiatan
                  </p>
                  <ul className="flex flex-col divide-y divide-border">
                    {suggestions.kegiatan.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/kegiatan/${item.slug}`}
                          onClick={() => {
                            setOpen(false);
                            onNavigate?.();
                          }}
                          className="flex flex-col gap-0.5 px-3 py-2.5 text-sm hover:bg-muted"
                        >
                          <span className="font-medium text-foreground">
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {suggestions.ebooks.length > 0 && (
                <>
                  <p className="border-t border-border px-3 pt-2.5 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    E-Book
                  </p>
                  <ul className="flex flex-col divide-y divide-border">
                    {suggestions.ebooks.map((ebook) => (
                      <li key={ebook.slug}>
                        <Link
                          href={`/e-book/${ebook.slug}`}
                          onClick={() => {
                            setOpen(false);
                            onNavigate?.();
                          }}
                          className="flex flex-col gap-0.5 px-3 py-2.5 text-sm hover:bg-muted"
                        >
                          <span className="font-medium text-foreground">
                            {ebook.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              Tidak ada hasil yang cocok.
            </p>
          )}
          <button
            type="button"
            onClick={() => goToSearch(query)}
            className="block w-full border-t border-border px-3 py-2.5 text-left text-sm font-medium text-primary hover:bg-muted"
          >
            Lihat semua hasil untuk &ldquo;{query}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}
