"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Plus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/slugify";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { QnaTopic, User } from "@/db/schema";

const NO_TOPIC = "none";

export type QnaFormInitialValues = {
  slug: string;
  title: string;
  question: string;
  answer: string;
  answeredById: string;
  topicId: string;
  isPublished: boolean;
};

export function QnaEditorForm({
  authors,
  topics,
  initialValues,
  submitLabel = "Simpan Tanya Jawab",
}: {
  authors: User[];
  topics: QnaTopic[];
  initialValues?: QnaFormInitialValues;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [question, setQuestion] = useState(initialValues?.question ?? "");
  const [answer, setAnswer] = useState(initialValues?.answer ?? "");
  const [answeredById, setAnsweredById] = useState(
    initialValues?.answeredById ?? authors[0]?.id ?? ""
  );
  const [topicList, setTopicList] = useState(topics);
  const [topicId, setTopicId] = useState(initialValues?.topicId || NO_TOPIC);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [addingTopic, setAddingTopic] = useState(false);
  const [topicError, setTopicError] = useState("");
  const [isPublished, setIsPublished] = useState(initialValues?.isPublished ?? false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
    setSaved(false);
  };

  const handleAddTopic = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = newTopicName.trim();
    if (!trimmed) return;

    setAddingTopic(true);
    setTopicError("");

    const res = await fetch("/api/qna-topic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    const data = await res.json().catch(() => ({}));
    setAddingTopic(false);

    if (!res.ok) {
      setTopicError(data.error ?? "Gagal menambah topik");
      return;
    }

    setTopicList((current) =>
      [...current, data.topic].sort((a, b) => a.name.localeCompare(b.name))
    );
    setTopicId(data.topic.id);
    setNewTopicName("");
    setShowAddTopic(false);
    setSaved(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const payload = {
      title,
      slug,
      question,
      answer,
      answeredById,
      topicId: topicId === NO_TOPIC ? null : topicId,
      isPublished,
    };

    try {
      const res = initialValues
        ? await fetch(`/api/tanya-jawab/${initialValues.slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/tanya-jawab", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Gagal menyimpan tanya jawab");
      }

      const data = await res.json();
      setSaved(true);

      if (!initialValues) {
        router.push(`/admin/tanya-jawab/${data.qna.slug}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan tanya jawab");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="Judul tanya jawab"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(event) => {
            setSlug(slugify(event.target.value));
            setSlugTouched(true);
            setSaved(false);
          }}
          placeholder="judul-tanya-jawab"
          readOnly={Boolean(initialValues)}
          disabled={Boolean(initialValues)}
          required
        />
        {initialValues && (
          <p className="text-xs text-muted-foreground">
            Slug/URL tidak bisa diubah setelah dibuat.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="question">Pertanyaan</Label>
        <Textarea
          id="question"
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);
            setSaved(false);
          }}
          rows={3}
          placeholder="Tulis pertanyaan..."
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Jawaban</Label>
        <RichTextEditor
          content={answer}
          onChange={(html) => {
            setAnswer(html);
            setSaved(false);
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="answered-by">Dijawab Oleh</Label>
        <Select
          items={authors.map((author) => ({ value: author.id, label: author.name }))}
          value={answeredById}
          onValueChange={(value) => setAnsweredById(value ?? "")}
        >
          <SelectTrigger id="answered-by" className="w-full sm:w-72">
            <SelectValue placeholder="Pilih penulis" />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="topic">Topik</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            items={[
              { value: NO_TOPIC, label: "Tanpa topik" },
              ...topicList.map((topic) => ({ value: topic.id, label: topic.name })),
            ]}
            value={topicId}
            onValueChange={(value) => {
              setTopicId(value ?? NO_TOPIC);
              setSaved(false);
            }}
          >
            <SelectTrigger id="topic" className="w-full sm:w-72">
              <SelectValue placeholder="Pilih topik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_TOPIC}>Tanpa topik</SelectItem>
              {topicList.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!showAddTopic && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddTopic(true)}
            >
              <Plus className="size-3.5" />
              Topik Baru
            </Button>
          )}
        </div>

        {showAddTopic && (
          <div className="mt-1 flex items-center gap-2">
            <Input
              value={newTopicName}
              onChange={(event) => {
                setNewTopicName(event.target.value);
                setTopicError("");
              }}
              placeholder="Contoh: Zakat"
              className="w-full sm:w-72"
              autoFocus
            />
            <Button type="button" size="sm" disabled={addingTopic} onClick={handleAddTopic}>
              {addingTopic ? "Menambah..." : "Tambah"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Batal"
              onClick={() => {
                setShowAddTopic(false);
                setNewTopicName("");
                setTopicError("");
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        )}
        {topicError && <p className="text-xs text-destructive">{topicError}</p>}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border p-3 sm:w-72">
        <Label htmlFor="is-published">Terbitkan</Label>
        <Switch
          id="is-published"
          checked={isPublished}
          onCheckedChange={(checked) => {
            setIsPublished(checked === true);
            setSaved(false);
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : submitLabel}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <CheckCircle2 className="size-4" />
            Perubahan tersimpan
          </span>
        )}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>
    </form>
  );
}
