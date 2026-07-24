"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trash2, FileDown, Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatDate } from "@/lib/format";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Question, QnaTopic } from "@/db/schema";

const STATUS_OPTIONS = [
  { value: "belum_dijawab", label: "Belum Dijawab" },
  { value: "sudah_dijawab", label: "Sudah Dijawab" },
  { value: "diarsipkan", label: "Diarsipkan" },
] as const;

const statusVariant: Record<
  Question["status"],
  "default" | "secondary" | "outline"
> = {
  belum_dijawab: "default",
  sudah_dijawab: "secondary",
  diarsipkan: "outline",
};

export function QuestionListTable({
  initialQuestions,
  topics,
}: {
  initialQuestions: Question[];
  topics: QnaTopic[];
}) {
  const [items, setItems] = useState(initialQuestions);
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<Question | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string | undefined>(undefined);

  const filteredItems = useMemo(
    () =>
      topicFilter
        ? items.filter((item) => item.topic === topicFilter)
        : items,
    [items, topicFilter]
  );

  const handleStatusChange = async (id: string, status: string) => {
    const previous = items;
    setError("");
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: status as Question["status"] } : item
      )
    );

    const res = await fetch(`/api/pertanyaan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setItems(previous);
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal mengubah status pertanyaan");
    }
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    const id = confirmTarget.id;
    setError("");
    setDeleting(true);
    const res = await fetch(`/api/pertanyaan/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menghapus pertanyaan");
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
            Pertanyaan Masuk
          </h1>
          <p className="text-sm text-muted-foreground">
            {items.length} pertanyaan dari pengunjung situs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" render={<Link href="/admin/pertanyaan/topik" />}>
            <Settings2 className="size-4" />
            Kelola Topik
          </Button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page route */}
          <Button variant="outline" render={<a href="/api/pertanyaan/export" />}>
            <FileDown className="size-4" />
            Ekspor Excel
          </Button>
        </div>
      </div>

      {topics.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <Select
            items={[
              { value: "__all__", label: "Semua topik" },
              ...topics.map((topic) => ({ value: topic.name, label: topic.name })),
            ]}
            value={topicFilter ?? "__all__"}
            onValueChange={(value) =>
              setTopicFilter(value && value !== "__all__" ? value : undefined)
            }
          >
            <SelectTrigger size="sm" className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Semua topik</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.name}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-muted-foreground">
          {items.length === 0
            ? "Belum ada pertanyaan masuk."
            : "Tidak ada pertanyaan untuk topik ini."}
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border sm:hidden">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">
                      {item.name || "Anonim"}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.city} &middot; {formatDate(item.createdAt.toISOString())}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Hapus pertanyaan dari ${item.name || "Anonim"}`}
                    onClick={() => setConfirmTarget(item)}
                    className="shrink-0"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
                <p className="text-sm text-foreground">{item.question}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {item.topic && <Badge variant="secondary">{item.topic}</Badge>}
                  {item.consent && (
                    <Badge variant="outline">Boleh dipublikasikan</Badge>
                  )}
                </div>
                <Select
                  items={STATUS_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  value={item.status}
                  onValueChange={(value) =>
                    value && handleStatusChange(item.id, value)
                  }
                >
                  <SelectTrigger size="sm" className="w-fit">
                    <Badge variant={statusVariant[item.status]}>
                      <SelectValue />
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="hidden rounded-xl border border-border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengirim</TableHead>
                  <TableHead>Topik</TableHead>
                  <TableHead>Pertanyaan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {item.name || "Anonim"}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {item.city}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.topic ?? "-"}
                    </TableCell>
                    <TableCell className="max-w-96 whitespace-normal">
                      {item.question}
                      {item.consent && (
                        <Badge variant="outline" className="ml-2 align-middle">
                          Boleh dipublikasikan
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(item.createdAt.toISOString())}
                    </TableCell>
                    <TableCell>
                      <Select
                        items={STATUS_OPTIONS.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                        value={item.status}
                        onValueChange={(value) =>
                          value && handleStatusChange(item.id, value)
                        }
                      >
                        <SelectTrigger size="sm" className="w-40">
                          <Badge variant={statusVariant[item.status]}>
                            <SelectValue />
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Hapus pertanyaan dari ${item.name || "Anonim"}`}
                        onClick={() => setConfirmTarget(item)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
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
        title="Hapus pertanyaan?"
        description={`Pertanyaan dari "${confirmTarget?.name || "Anonim"}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
