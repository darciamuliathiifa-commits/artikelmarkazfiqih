"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus, Eye, Tag } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { formatDate, formatViews } from "@/lib/format";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Article, Category, User } from "@/db/schema";

const ALL_CATEGORIES = "semua";

type ArticleRow = Article & { category: Category; author: User };

export function ArticleListTable({
  initialArticles,
  categories,
}: {
  initialArticles: ArticleRow[];
  categories: Category[];
}) {
  const [items, setItems] = useState(initialArticles);
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState(ALL_CATEGORIES);
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<ArticleRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((article) => {
      const matchesSearch = query
        ? article.title.toLowerCase().includes(query)
        : true;
      const matchesCategory =
        categorySlug === ALL_CATEGORIES || article.category.slug === categorySlug;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categorySlug]);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    const slug = confirmTarget.slug;
    setError("");
    setDeleting(true);
    const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus artikel");
      setConfirmTarget(null);
      return;
    }

    setItems((current) => current.filter((article) => article.slug !== slug));
    setConfirmTarget(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Kelola Artikel
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} dari {items.length} artikel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" render={<Link href="/admin/artikel/tag" />}>
            <Tag className="size-4" />
            Kelola Tag
          </Button>
          <Button render={<Link href="/admin/artikel/baru" />}>
            <Plus className="size-4" />
            Tulis Artikel
          </Button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari judul artikel..."
          className="sm:max-w-xs"
        />
        <Select
          items={[
            { value: ALL_CATEGORIES, label: "Semua Kategori" },
            ...categories.map((category) => ({
              value: category.slug,
              label: category.name,
            })),
          ]}
          value={categorySlug}
          onValueChange={(value) => setCategorySlug(value ?? ALL_CATEGORIES)}
        >
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          Tidak ada artikel yang cocok.
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {filtered.map((article) => (
              <div key={article.slug} className="flex items-center gap-3 p-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {article.thumbnailUrl && (
                    <Image
                      src={article.thumbnailUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate font-medium text-foreground">
                      {article.title}
                    </span>
                    {!article.isPublished && (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        Draf
                      </Badge>
                    )}
                    {article.isFeatured && (
                      <Badge className="shrink-0 text-xs">Unggulan</Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {article.category.name}
                    </Badge>
                    <span>{article.author.name}</span>
                    <span>
                      {formatDate(
                        (article.publishedAt ?? article.createdAt).toISOString()
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3.5" />
                      {formatViews(article.views)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${article.title}`}
                    render={<Link href={`/admin/artikel/${article.slug}/edit`} />}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Hapus ${article.title}`}
                    onClick={() => setConfirmTarget(article)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden rounded-xl border border-border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artikel</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>
                    <span className="sr-only">Views</span>
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((article) => (
                  <TableRow key={article.slug}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {article.thumbnailUrl && (
                            <Image
                              src={article.thumbnailUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                        <span className="max-w-64 truncate font-medium text-foreground">
                          {article.title}
                        </span>
                        {!article.isPublished && (
                          <Badge variant="outline" className="shrink-0 text-xs">
                            Draf
                          </Badge>
                        )}
                        {article.isFeatured && (
                          <Badge className="shrink-0 text-xs">Unggulan</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {article.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {article.author.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(
                        (article.publishedAt ?? article.createdAt).toISOString()
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="size-3.5" />
                        {formatViews(article.views)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${article.title}`}
                          render={
                            <Link href={`/admin/artikel/${article.slug}/edit`} />
                          }
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus ${article.title}`}
                          onClick={() => setConfirmTarget(article)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => !open && setConfirmTarget(null)}
        title="Hapus artikel?"
        description={`Artikel "${confirmTarget?.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
