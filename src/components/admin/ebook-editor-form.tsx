"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { CheckCircle2, Upload, X, ImageIcon, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/lib/slugify";
import { MediaGalleryDialog } from "@/components/admin/media-gallery-dialog";

export type EbookFormInitialValues = {
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  previewImages: string[];
  purchaseUrl: string;
  isPublished: boolean;
};

type GalleryTarget = "cover" | "preview";

export function EbookEditorForm({
  initialValues,
  submitLabel = "Simpan E-Book",
}: {
  initialValues?: EbookFormInitialValues;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialValues?.coverImageUrl ?? "");
  const [previewImages, setPreviewImages] = useState<string[]>(
    initialValues?.previewImages ?? []
  );
  const [purchaseUrl, setPurchaseUrl] = useState(initialValues?.purchaseUrl ?? "");
  const [isPublished, setIsPublished] = useState(initialValues?.isPublished ?? false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryTarget, setGalleryTarget] = useState<GalleryTarget | null>(null);
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
      description,
      coverImageUrl: coverImageUrl || undefined,
      previewImages,
      purchaseUrl: purchaseUrl || undefined,
      isPublished,
    };

    try {
      const res = initialValues
        ? await fetch(`/api/ebook/${initialValues.slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/ebook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Gagal menyimpan e-book");
      }

      const data = await res.json();
      setSaved(true);

      if (!initialValues) {
        router.push(`/admin/ebook/${data.ebook.slug}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan e-book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Judul E-Book</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="Judul e-book"
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
            placeholder="judul-ebook"
            readOnly={Boolean(initialValues)}
            disabled={Boolean(initialValues)}
            required
          />
          {initialValues && (
            <p className="text-xs text-muted-foreground">
              Slug/URL e-book tidak bisa diubah setelah dibuat.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setSaved(false);
            }}
            rows={6}
            placeholder="Deskripsi lengkap e-book, isi/daftar bab, dsb."
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Preview / Gambar Isi</Label>
          <p className="text-xs text-muted-foreground">
            Contoh: cover, daftar isi, atau cuplikan halaman e-book.
          </p>
          <div className="flex flex-wrap gap-3">
            {previewImages.map((url, index) => (
              <div key={url + index} className="relative">
                <div className="relative size-24 overflow-hidden rounded-lg border border-border bg-muted">
                  <NextImage
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Hapus gambar preview"
                  onClick={() => {
                    setPreviewImages((current) => current.filter((_, i) => i !== index));
                    setSaved(false);
                  }}
                  className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setGalleryTarget("preview")}
              className="flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-4" />
              <span className="text-xs">Tambah</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Publikasikan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is-published">Terbitkan e-book</Label>
              <Switch
                id="is-published"
                checked={isPublished}
                onCheckedChange={(checked) => {
                  setIsPublished(checked === true);
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
            <CardTitle>Detail E-Book</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Cover</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex aspect-[3/4] w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                  {coverImageUrl ? (
                    <NextImage
                      src={coverImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
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
                    onClick={() => setGalleryTarget("cover")}
                  >
                    <Upload className="size-3.5" />
                    {coverImageUrl ? "Ganti Cover" : "Unggah Cover"}
                  </Button>
                  {coverImageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCoverImageUrl("");
                        setSaved(false);
                      }}
                    >
                      <X className="size-3.5" />
                      Hapus Cover
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="purchase-url">URL Pembelian (Lynk.id)</Label>
              <Input
                id="purchase-url"
                type="url"
                value={purchaseUrl}
                onChange={(event) => {
                  setPurchaseUrl(event.target.value);
                  setSaved(false);
                }}
                placeholder="https://lynk.id/..."
              />
              <p className="text-xs text-muted-foreground">
                Tombol &quot;Beli&quot; di halaman e-book mengarah ke URL ini.
                Kosongkan jika belum tersedia.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <MediaGalleryDialog
        open={galleryTarget !== null}
        onOpenChange={(open) => {
          if (!open) setGalleryTarget(null);
        }}
        onInsert={({ src }) => {
          if (galleryTarget === "cover") {
            setCoverImageUrl(src);
          } else if (galleryTarget === "preview") {
            setPreviewImages((current) => [...current, src]);
          }
          setGalleryTarget(null);
          setSaved(false);
        }}
      />
    </form>
  );
}
