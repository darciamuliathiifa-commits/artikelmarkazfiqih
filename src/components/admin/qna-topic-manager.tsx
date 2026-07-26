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

type TopicRow = { id: string; name: string; usageCount: number };

export function QnaTopicManager({ initialTopics }: { initialTopics: TopicRow[] }) {
  const [topics, setTopics] = useState<TopicRow[]>(initialTopics);
  const [newTopicName, setNewTopicName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<TopicRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const existingNames = useMemo(
    () => new Set(topics.map((topic) => topic.name.toLowerCase())),
    [topics]
  );

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = newTopicName.trim();
    if (!trimmed) return;
    if (existingNames.has(trimmed.toLowerCase())) {
      setError("Topik dengan nama tersebut sudah ada.");
      return;
    }

    const res = await fetch("/api/qna-topic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Gagal menambah topik");
      return;
    }

    setTopics((current) =>
      [
        ...current,
        { id: data.topic.id, name: data.topic.name, usageCount: 0 },
      ].sort((a, b) => a.name.localeCompare(b.name))
    );
    setNewTopicName("");
    setError("");
  };

  const startEdit = (topic: TopicRow) => {
    setEditingId(topic.id);
    setEditingValue(topic.name);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const confirmEdit = async (id: string) => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;
    const duplicate = topics.some(
      (topic) => topic.id !== id && topic.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setError("Topik dengan nama tersebut sudah ada.");
      return;
    }

    const res = await fetch(`/api/qna-topic/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Gagal mengubah topik");
      return;
    }

    setTopics((current) =>
      current
        .map((topic) => (topic.id === id ? { ...topic, name: data.topic.name } : topic))
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
    const res = await fetch(`/api/qna-topic/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus topik");
      setConfirmTarget(null);
      return;
    }

    setTopics((current) => current.filter((topic) => topic.id !== id));
    if (editingId === id) cancelEdit();
    setConfirmTarget(null);
  };

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
        Kelola Topik Tanya Jawab
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Tambah, ubah, atau hapus topik yang bisa dipilih pengunjung saat
        mengirim pertanyaan, agar tim redaksi lebih mudah memfilternya.
      </p>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <Input
          value={newTopicName}
          onChange={(event) => {
            setNewTopicName(event.target.value);
            setError("");
          }}
          placeholder="Nama topik baru"
          className="max-w-xs"
        />
        <Button type="submit">
          <Plus className="size-4" />
          Tambah Topik
        </Button>
      </form>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {topics.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          Belum ada topik.
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {topics.map((topic) => (
              <div key={topic.id} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  {editingId === topic.id ? (
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
                        <span className="truncate">{topic.name}</span>
                      </span>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {topic.usageCount} pertanyaan
                      </p>
                    </>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {editingId === topic.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Simpan ${topic.name}`}
                        onClick={() => confirmEdit(topic.id)}
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
                        aria-label={`Edit ${topic.name}`}
                        onClick={() => startEdit(topic)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Hapus ${topic.name}`}
                        onClick={() => setConfirmTarget(topic)}
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
                  <TableHead>Topik</TableHead>
                  <TableHead>Digunakan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell>
                      {editingId === topic.id ? (
                        <Input
                          value={editingValue}
                          onChange={(event) => setEditingValue(event.target.value)}
                          autoFocus
                          className="h-8 max-w-56"
                        />
                      ) : (
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <TagIcon className="size-3.5 text-muted-foreground" />
                          {topic.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {topic.usageCount} pertanyaan
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {editingId === topic.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Simpan ${topic.name}`}
                              onClick={() => confirmEdit(topic.id)}
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
                              aria-label={`Edit ${topic.name}`}
                              onClick={() => startEdit(topic)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Hapus ${topic.name}`}
                              onClick={() => setConfirmTarget(topic)}
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
        title="Hapus topik?"
        description={`Topik "${confirmTarget?.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
