"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";

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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Agenda } from "@/db/schema";

const TYPE_LABELS: Record<Agenda["type"], string> = {
  rutin: "Jadwal Rutin",
  khusus: "Acara Khusus",
};

export function AgendaListTable({ initialAgenda }: { initialAgenda: Agenda[] }) {
  const [items, setItems] = useState(initialAgenda);
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<Agenda | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    const id = confirmTarget.id;
    setError("");
    setDeleting(true);
    const res = await fetch(`/api/agenda/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus agenda");
      setConfirmTarget(null);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    setConfirmTarget(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Agenda
          </h1>
          <p className="text-sm text-muted-foreground">
            {items.length} agenda dikelola.
          </p>
        </div>
        <Button render={<Link href="/admin/agenda/baru" />}>
          <Plus className="size-4" />
          Tambah Agenda
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {items.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          Belum ada agenda.
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">
                      {item.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.scheduleText}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${item.title}`}
                      render={<Link href={`/admin/agenda/${item.id}/edit`} />}
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
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{TYPE_LABELS[item.type]}</Badge>
                  {!item.isPublished && <Badge variant="outline">Draf</Badge>}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden rounded-xl border border-border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {item.title}
                      </span>
                      {!item.isPublished && (
                        <Badge variant="outline" className="ml-2 align-middle">
                          Draf
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{TYPE_LABELS[item.type]}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.scheduleText}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${item.title}`}
                          render={<Link href={`/admin/agenda/${item.id}/edit`} />}
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
        title="Hapus agenda?"
        description={`Agenda "${confirmTarget?.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
