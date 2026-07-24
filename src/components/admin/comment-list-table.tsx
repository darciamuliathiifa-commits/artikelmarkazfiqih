"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { getAllCommentsForAdmin } from "@/db/queries/comments";

type CommentRow = Awaited<ReturnType<typeof getAllCommentsForAdmin>>[number];

function TargetLink({ comment }: { comment: CommentRow }) {
  if (comment.article) {
    return (
      <Link
        href={`/artikel/${comment.article.slug}`}
        target="_blank"
        className="text-primary hover:underline"
      >
        {comment.article.title}
      </Link>
    );
  }
  if (comment.qna) {
    return (
      <Link
        href={`/tanya-jawab/${comment.qna.slug}`}
        target="_blank"
        className="text-primary hover:underline"
      >
        {comment.qna.title}
      </Link>
    );
  }
  return <span className="text-muted-foreground">&mdash;</span>;
}

export function CommentListTable({
  initialComments,
}: {
  initialComments: CommentRow[];
}) {
  const [items, setItems] = useState(initialComments);
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<CommentRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleApprovalChange = async (id: string, isApproved: boolean) => {
    const previous = items;
    setError("");
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, isApproved } : item))
    );

    const res = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });

    if (!res.ok) {
      setItems(previous);
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal mengubah status komentar");
    }
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    const id = confirmTarget.id;
    setError("");
    setDeleting(true);
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus komentar");
      setConfirmTarget(null);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    setConfirmTarget(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Komentar
        </h1>
        <p className="text-sm text-muted-foreground">
          {items.length} komentar dari pengunjung situs.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {items.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          Belum ada komentar masuk.
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.email}
                    </span>
                  </div>
                  <Badge variant={item.isApproved ? "default" : "secondary"}>
                    {item.isApproved ? "Disetujui" : "Menunggu"}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{item.content}</p>
                <p className="text-xs text-muted-foreground">
                  Pada: <TargetLink comment={item} /> &middot;{" "}
                  {formatDate(item.createdAt.toISOString())}
                </p>
                <div className="flex items-center gap-2">
                  {item.isApproved ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprovalChange(item.id, false)}
                    >
                      <X className="size-3.5" />
                      Batalkan
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleApprovalChange(item.id, true)}
                    >
                      <Check className="size-3.5" />
                      Setujui
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Hapus komentar dari ${item.name}`}
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
                  <TableHead>Pengirim</TableHead>
                  <TableHead>Komentar</TableHead>
                  <TableHead>Pada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {item.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {item.email}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-96 whitespace-normal">
                      {item.content}
                    </TableCell>
                    <TableCell className="max-w-56 whitespace-normal text-muted-foreground">
                      <TargetLink comment={item} />
                      <span className="block text-xs">
                        {formatDate(item.createdAt.toISOString())}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isApproved ? "default" : "secondary"}>
                        {item.isApproved ? "Disetujui" : "Menunggu"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {item.isApproved ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprovalChange(item.id, false)}
                          >
                            <X className="size-3.5" />
                            Batalkan
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleApprovalChange(item.id, true)}
                          >
                            <Check className="size-3.5" />
                            Setujui
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus komentar dari ${item.name}`}
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
        title="Hapus komentar?"
        description={`Komentar dari "${confirmTarget?.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
