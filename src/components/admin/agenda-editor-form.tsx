"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { CheckCircle2, Upload, X, ImageIcon } from "lucide-react";

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
import { MediaGalleryDialog } from "@/components/admin/media-gallery-dialog";

const TYPE_OPTIONS = [
  { value: "rutin", label: "Jadwal Rutin" },
  { value: "khusus", label: "Acara Khusus" },
] as const;

export type AgendaFormInitialValues = {
  id: string;
  title: string;
  type: "rutin" | "khusus";
  scheduleText: string;
  description: string;
  pengajar: string;
  imageUrl: string;
  linkUrl: string;
  isPublished: boolean;
};

export function AgendaEditorForm({
  initialValues,
  submitLabel = "Simpan Agenda",
}: {
  initialValues?: AgendaFormInitialValues;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [type, setType] = useState<"rutin" | "khusus">(
    initialValues?.type ?? "rutin"
  );
  const [scheduleText, setScheduleText] = useState(
    initialValues?.scheduleText ?? ""
  );
  const [pengajar, setPengajar] = useState(initialValues?.pengajar ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(initialValues?.linkUrl ?? "");
  const [isPublished, setIsPublished] = useState(
    initialValues?.isPublished ?? true
  );
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const payload = {
      title,
      type,
      scheduleText,
      pengajar,
      description,
      imageUrl,
      linkUrl,
      isPublished,
    };

    try {
      const res = initialValues
        ? await fetch(`/api/agenda/${initialValues.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/agenda", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Gagal menyimpan agenda");
      }

      const data = await res.json();
      setSaved(true);

      if (!initialValues) {
        router.push(`/admin/agenda/${data.agenda.id}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan agenda");
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
          onChange={(event) => {
            setTitle(event.target.value);
            setSaved(false);
          }}
          placeholder="Judul agenda"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="type">Jenis</Label>
        <Select
          items={TYPE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          value={type}
          onValueChange={(value) => {
            if (value) setType(value as "rutin" | "khusus");
            setSaved(false);
          }}
        >
          <SelectTrigger id="type" className="w-full sm:w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="schedule-text">Jadwal</Label>
        <Input
          id="schedule-text"
          value={scheduleText}
          onChange={(event) => {
            setScheduleText(event.target.value);
            setSaved(false);
          }}
          placeholder="Contoh: Setiap Senin, 20.00 WIB atau Sabtu, 16 Agustus 2026"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pengajar">Pengajar / Narasumber (opsional)</Label>
        <Input
          id="pengajar"
          value={pengajar}
          onChange={(event) => {
            setPengajar(event.target.value);
            setSaved(false);
          }}
          placeholder="Nama pengajar atau narasumber"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Deskripsi (opsional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            setSaved(false);
          }}
          rows={4}
          placeholder="Deskripsi singkat agenda"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Gambar / Poster (opsional)</Label>
        <div className="flex items-center gap-4">
          <div className="relative flex aspect-video w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
            {imageUrl ? (
              <NextImage
                src={imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <ImageIcon className="size-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGalleryOpen(true)}
            >
              <Upload className="size-3.5" />
              {imageUrl ? "Ganti Gambar" : "Unggah Gambar"}
            </Button>
            {imageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImageUrl("");
                  setSaved(false);
                }}
              >
                <X className="size-3.5" />
                Hapus Gambar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="link-url">Link (opsional)</Label>
        <Input
          id="link-url"
          type="url"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
            setSaved(false);
          }}
          placeholder="https://... (Zoom, WhatsApp, pendaftaran, dsb.)"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border p-3 sm:w-72">
        <Label htmlFor="is-published">Tampilkan</Label>
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

      <MediaGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onInsert={({ src }) => {
          setImageUrl(src);
          setSaved(false);
        }}
      />
    </form>
  );
}
