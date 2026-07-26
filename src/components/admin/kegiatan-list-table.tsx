"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Kegiatan } from "@/db/schema";

export function KegiatanListTable({
  initialKegiatan,
}: {
  initialKegiatan: Kegiatan[];
}) {
  const [items, setItems] = useState(initialKegiatan);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<Kegiatan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.title.toLowerCase().includes(query));
  }, [items, search]);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    const slug = confirmTarget.slug;
    setError("");
    setDeleting(true);
    const res = await fetch(`/api/kegiatan/${slug}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus kegiatan");
      setConfirmTarget(null);
      return;
    }

    setItems((current) => current.filter((item) => item.slug !== slug));
    setConfirmTarget(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Kelola Kegiatan
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} dari {items.length} kegiatan
          </p>
        </div>
        <Button render={<Link href="/admin/kegiatan/baru" />}>
          <Plus className="size-4" />
          Tambah Kegiatan
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="mb-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari judul kegiatan..."
          className="sm:max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          Tidak ada kegiatan yang cocok.
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {filtered.map((item) => (
              <div key={item.slug} className="flex items-center gap-3 p-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.thumbnailUrl && (
                    <Image
                      src={item.thumbnailUrl}
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
                      {item.title}
                    </span>
                    {!item.isPublished && (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        Draf
                      </Badge>
                    )}
                    {item.isFeatured && (
                      <Badge className="shrink-0 text-xs">Unggulan</Badge>
                    )}
                  </div>
                  {item.eventDate && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {formatDate(item.eventDate.toISOString())}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${item.title}`}
                    render={<Link href={`/admin/kegiatan/${item.slug}/edit`} />}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Hapus ${item.title}`}
                    onClick={() => setConfirmTarget(item)}
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
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.thumbnailUrl && (
                            <Image
                              src={item.thumbnailUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                        <span className="max-w-64 truncate font-medium text-foreground">
                          {item.title}
                        </span>
                        {!item.isPublished && (
                          <Badge variant="outline" className="shrink-0 text-xs">
                            Draf
                          </Badge>
                        )}
                        {item.isFeatured && (
                          <Badge className="shrink-0 text-xs">Unggulan</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.eventDate ? formatDate(item.eventDate.toISOString()) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${item.title}`}
                          render={<Link href={`/admin/kegiatan/${item.slug}/edit`} />}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus ${item.title}`}
                          onClick={() => setConfirmTarget(item)}
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
        title="Hapus kegiatan?"
        description={`Kegiatan "${confirmTarget?.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
