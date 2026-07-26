"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import type { Qna, QnaTopic, User } from "@/db/schema";

type QnaRow = Qna & { answeredBy: User; topic: QnaTopic | null };

export function QnaListTable({ initialQna }: { initialQna: QnaRow[] }) {
  const [items, setItems] = useState(initialQna);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<QnaRow | null>(null);
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
    const res = await fetch(`/api/tanya-jawab/${slug}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus tanya jawab");
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
            Kelola Tanya Jawab
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} dari {items.length} tanya jawab
          </p>
        </div>
        <Button render={<Link href="/admin/tanya-jawab/baru" />}>
          <Plus className="size-4" />
          Tambah Tanya Jawab
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cari judul tanya jawab..."
        className="mb-4 sm:max-w-xs"
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          Tidak ada tanya jawab yang cocok.
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {filtered.map((item) => (
              <div key={item.slug} className="flex items-center gap-3 p-3">
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
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    {item.topic && (
                      <Badge variant="secondary" className="text-xs">
                        {item.topic.name}
                      </Badge>
                    )}
                    <span>{item.answeredBy.name}</span>
                    <span>{formatDate(item.createdAt.toISOString())}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${item.title}`}
                    render={<Link href={`/admin/tanya-jawab/${item.slug}/edit`} />}
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
                  <TableHead>Judul</TableHead>
                  <TableHead>Topik</TableHead>
                  <TableHead>Dijawab Oleh</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <div className="flex max-w-80 items-center gap-2">
                        <span className="truncate font-medium text-foreground">
                          {item.title}
                        </span>
                        {!item.isPublished && (
                          <Badge variant="outline" className="shrink-0 text-xs">
                            Draf
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.topic && (
                        <Badge variant="secondary" className="text-xs">
                          {item.topic.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.answeredBy.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(item.createdAt.toISOString())}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${item.title}`}
                          render={
                            <Link href={`/admin/tanya-jawab/${item.slug}/edit`} />
                          }
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
        title="Hapus tanya jawab?"
        description={`Tanya jawab "${confirmTarget?.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
