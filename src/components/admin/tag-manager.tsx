"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Check, X, Tag as TagIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
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

type TagRow = { id: string; name: string; usageCount: number };

export function TagManager({ initialTags }: { initialTags: TagRow[] }) {
  const [tags, setTags] = useState<TagRow[]>(initialTags);
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<TagRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const existingNames = useMemo(
    () => new Set(tags.map((tag) => tag.name.toLowerCase())),
    [tags]
  );

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    if (existingNames.has(trimmed.toLowerCase())) {
      setError("Tag dengan nama tersebut sudah ada.");
      return;
    }

    const res = await fetch("/api/tag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Gagal menambah tag");
      return;
    }

    setTags((current) =>
      [...current, { id: data.tag.id, name: data.tag.name, usageCount: 0 }].sort(
        (a, b) => a.name.localeCompare(b.name)
      )
    );
    setNewTagName("");
    setError("");
  };

  const startEdit = (tag: TagRow) => {
    setEditingId(tag.id);
    setEditingValue(tag.name);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const confirmEdit = async (id: string) => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;
    const duplicate = tags.some(
      (tag) => tag.id !== id && tag.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setError("Tag dengan nama tersebut sudah ada.");
      return;
    }

    const res = await fetch(`/api/tag/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Gagal mengubah tag");
      return;
    }

    setTags((current) =>
      current
        .map((tag) => (tag.id === id ? { ...tag, name: data.tag.name } : tag))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditingId(null);
    setEditingValue("");
    setError("");
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    const id = confirmTarget.id;
    setError("");
    setDeleting(true);
    const res = await fetch(`/api/tag/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus tag");
      setConfirmTarget(null);
      return;
    }

    setTags((current) => current.filter((tag) => tag.id !== id));
    if (editingId === id) cancelEdit();
    setConfirmTarget(null);
  };

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
        Kelola Tag
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Tambah, ubah, atau hapus tag untuk mengelompokkan artikel dan meningkatkan
        ketercarian.
      </p>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <Input
          value={newTagName}
          onChange={(event) => {
            setNewTagName(event.target.value);
            setError("");
          }}
          placeholder="Nama tag baru"
          className="max-w-xs"
        />
        <Button type="submit">
          <Plus className="size-4" />
          Tambah Tag
        </Button>
      </form>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {tags.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          Belum ada tag.
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  {editingId === tag.id ? (
                    <Input
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      autoFocus
                      className="h-8"
                    />
                  ) : (
                    <>
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <TagIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{tag.name}</span>
                      </span>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {tag.usageCount} artikel
                      </p>
                    </>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {editingId === tag.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Simpan ${tag.name}`}
                        onClick={() => confirmEdit(tag.id)}
                      >
                        <Check className="size-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Batal"
                        onClick={cancelEdit}
                      >
                        <X className="size-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${tag.name}`}
                        onClick={() => startEdit(tag)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Hapus ${tag.name}`}
                        onClick={() => setConfirmTarget(tag)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden rounded-xl border border-border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Digunakan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      {editingId === tag.id ? (
                        <Input
                          value={editingValue}
                          onChange={(event) => setEditingValue(event.target.value)}
                          autoFocus
                          className="h-8 max-w-56"
                        />
                      ) : (
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <TagIcon className="size-3.5 text-muted-foreground" />
                          {tag.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tag.usageCount} artikel
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {editingId === tag.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Simpan ${tag.name}`}
                              onClick={() => confirmEdit(tag.id)}
                            >
                              <Check className="size-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Batal"
                              onClick={cancelEdit}
                            >
                              <X className="size-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Edit ${tag.name}`}
                              onClick={() => startEdit(tag)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Hapus ${tag.name}`}
                              onClick={() => setConfirmTarget(tag)}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </>
                        )}
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
        title="Hapus tag?"
        description={`Tag "${confirmTarget?.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
