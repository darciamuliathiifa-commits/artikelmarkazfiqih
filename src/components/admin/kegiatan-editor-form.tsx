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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugify } from "@/lib/slugify";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ArticlePreview } from "@/components/admin/article-preview";
import { MediaGalleryDialog } from "@/components/admin/media-gallery-dialog";

export type KegiatanFormInitialValues = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  eventDate: string;
  isPublished: boolean;
  isFeatured: boolean;
};

export function KegiatanEditorForm({
  initialValues,
  submitLabel = "Simpan Kegiatan",
}: {
  initialValues?: KegiatanFormInitialValues;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValues?.thumbnailUrl ?? "");
  const [eventDate, setEventDate] = useState(initialValues?.eventDate ?? "");
  const [isPublished, setIsPublished] = useState(initialValues?.isPublished ?? false);
  const [isFeatured, setIsFeatured] = useState(initialValues?.isFeatured ?? false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const router = useRouter();

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
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
      excerpt,
      content,
      thumbnailUrl: thumbnailUrl || undefined,
      eventDate: eventDate || null,
      isPublished,
      isFeatured,
    };

    try {
      const res = initialValues
        ? await fetch(`/api/kegiatan/${initialValues.slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/kegiatan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Gagal menyimpan kegiatan");
      }

      const data = await res.json();
      setSaved(true);

      if (!initialValues) {
        router.push(`/admin/kegiatan/${data.kegiatan.slug}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan kegiatan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Tabs defaultValue="tulis">
          <TabsList className="mb-5">
            <TabsTrigger value="tulis">Tulis</TabsTrigger>
            <TabsTrigger value="pratinjau">Pratinjau</TabsTrigger>
          </TabsList>

          <TabsContent value="tulis" className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Judul Kegiatan</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Judul kegiatan"
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
                placeholder="judul-kegiatan"
                readOnly={Boolean(initialValues)}
                disabled={Boolean(initialValues)}
                required
              />
              {initialValues && (
                <p className="text-xs text-muted-foreground">
                  Slug/URL kegiatan tidak bisa diubah setelah dibuat.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(event) => {
                  setExcerpt(event.target.value);
                  setSaved(false);
                }}
                rows={2}
                placeholder="Ringkasan singkat yang tampil di daftar kegiatan"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Konten</Label>
              <RichTextEditor
                content={content}
                onChange={(html) => {
                  setContent(html);
                  setSaved(false);
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="pratinjau">
            <ArticlePreview
              title={title}
              thumbnailUrl={thumbnailUrl}
              contentHtml={content}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Publikasikan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is-published">Terbitkan kegiatan</Label>
              <Switch
                id="is-published"
                checked={isPublished}
                onCheckedChange={(checked) => {
                  setIsPublished(checked === true);
                  setSaved(false);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="is-featured">Tampilkan di beranda</Label>
                <span className="text-xs text-muted-foreground">
                  Muncul di bagian Kegiatan pada homepage
                </span>
              </div>
              <Switch
                id="is-featured"
                checked={isFeatured}
                onCheckedChange={(checked) => {
                  setIsFeatured(checked === true);
                  setSaved(false);
                }}
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Menyimpan..." : submitLabel}
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-primary">
                <CheckCircle2 className="size-4" />
                Perubahan tersimpan
              </span>
            )}
            {error && <span className="text-sm text-destructive">{error}</span>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Kegiatan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-date">Tanggal Kegiatan</Label>
              <Input
                id="event-date"
                type="date"
                value={eventDate}
                onChange={(event) => {
                  setEventDate(event.target.value);
                  setSaved(false);
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Thumbnail</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex aspect-video w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                  {thumbnailUrl ? (
                    <NextImage
                      src={thumbnailUrl}
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
                    {thumbnailUrl ? "Ganti Thumbnail" : "Unggah Thumbnail"}
                  </Button>
                  {thumbnailUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setThumbnailUrl("");
                        setSaved(false);
                      }}
                    >
                      <X className="size-3.5" />
                      Hapus Thumbnail
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MediaGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onInsert={({ src }) => {
          setThumbnailUrl(src);
          setSaved(false);
        }}
      />
    </form>
  );
}
