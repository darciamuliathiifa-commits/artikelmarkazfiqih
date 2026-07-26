"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";

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

type ContributorRow = {
  id: string;
  slug: string;
  name: string;
  avatarUrl: string | null;
  articleCount: number;
};

export function ContributorListTable({
  initialContributors,
}: {
  initialContributors: ContributorRow[];
}) {
  const [items, setItems] = useState(initialContributors);
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<ContributorRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    const slug = confirmTarget.slug;
    setError("");
    setDeleting(true);
    const res = await fetch(`/api/kontributor/${slug}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus kontributor");
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
            Kelola Kontributor
          </h1>
          <p className="text-sm text-muted-foreground">
            {items.length} kontributor
          </p>
        </div>
        <Button render={<Link href="/admin/kontributor/baru" />}>
          <Plus className="size-4" />
          Tambah Kontributor
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {items.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          Belum ada kontributor.
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {items.map((contributor) => (
              <div key={contributor.id} className="flex items-center gap-3 p-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  {contributor.avatarUrl && (
                    <Image
                      src={contributor.avatarUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {contributor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {contributor.articleCount} artikel
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${contributor.name}`}
                    render={<Link href={`/admin/kontributor/${contributor.slug}/edit`} />}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Hapus ${contributor.name}`}
                    onClick={() => setConfirmTarget(contributor)}
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
                  <TableHead>Kontributor</TableHead>
                  <TableHead>Artikel</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((contributor) => (
                  <TableRow key={contributor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted">
                          {contributor.avatarUrl && (
                            <Image
                              src={contributor.avatarUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="36px"
                            />
                          )}
                        </div>
                        <span className="font-medium text-foreground">
                          {contributor.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contributor.articleCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${contributor.name}`}
                          render={
                            <Link href={`/admin/kontributor/${contributor.slug}/edit`} />
                          }
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus ${contributor.name}`}
                          onClick={() => setConfirmTarget(contributor)}
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
        title="Hapus kontributor?"
        description={`Kontributor "${confirmTarget?.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
