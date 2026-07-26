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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugify } from "@/lib/slugify";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ArticlePreview } from "@/components/admin/article-preview";
import { MediaGalleryDialog } from "@/components/admin/media-gallery-dialog";
import type { Category, User } from "@/db/schema";

export type ArticleFormInitialValues = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorId: string;
  tags: string;
  thumbnailUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
  metaDescription: string;
};

export function ArticleEditorForm({
  categories,
  authors,
  initialValues,
  submitLabel = "Simpan Artikel",
}: {
  categories: Category[];
  authors: User[];
  initialValues?: ArticleFormInitialValues;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [categoryId, setCategoryId] = useState<string>(
    initialValues?.categoryId ?? categories[0]?.id ?? ""
  );
  const [authorId, setAuthorId] = useState<string>(
    initialValues?.authorId ?? authors[0]?.id ?? ""
  );
  const [tags, setTags] = useState(initialValues?.tags ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValues?.thumbnailUrl ?? "");
  const [metaDescription, setMetaDescription] = useState(initialValues?.metaDescription ?? "");
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
      categoryId,
      authorId,
      thumbnailUrl: thumbnailUrl || undefined,
      metaDescription: metaDescription || undefined,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isPublished,
      isFeatured,
    };

    try {
      const res = initialValues
        ? await fetch(`/api/articles/${initialValues.slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Gagal menyimpan artikel");
      }

      const data = await res.json();
      setSaved(true);

      if (!initialValues) {
        router.push(`/admin/artikel/${data.article.slug}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory = categories.find((category) => category.id === categoryId);
  const selectedAuthor = authors.find((author) => author.id === authorId);

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
              <Label htmlFor="title">Judul Artikel</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Judul artikel"
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
                placeholder="judul-artikel"
                readOnly={Boolean(initialValues)}
                disabled={Boolean(initialValues)}
                required
              />
              {initialValues && (
                <p className="text-xs text-muted-foreground">
                  Slug/URL artikel tidak bisa diubah setelah dibuat.
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
                placeholder="Ringkasan singkat yang tampil di daftar artikel"
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
              categoryName={selectedCategory?.name}
              authorName={selectedAuthor?.name}
              authorAvatarUrl={selectedAuthor?.avatarUrl ?? undefined}
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
              <Label htmlFor="is-published">Terbitkan artikel</Label>
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
                <Label htmlFor="is-featured">Jadikan unggulan</Label>
                <span className="text-xs text-muted-foreground">
                  Tampilkan di carousel beranda
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
            <CardTitle>Detail Artikel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Kategori</Label>
              <Select
                items={categories.map((category) => ({ value: category.id, label: category.name }))}
                value={categoryId}
                onValueChange={(value) => setCategoryId(value ?? "")}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="author">Penulis</Label>
              <Select
                items={authors.map((author) => ({ value: author.id, label: author.name }))}
                value={authorId}
                onValueChange={(value) => setAuthorId(value ?? "")}
              >
                <SelectTrigger id="author" className="w-full">
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
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(event) => {
                  setTags(event.target.value);
                  setSaved(false);
                }}
                placeholder="pisahkan dengan koma"
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meta-description">Meta Deskripsi (SEO)</Label>
              <Textarea
                id="meta-description"
                value={metaDescription}
                onChange={(event) => {
                  setMetaDescription(event.target.value);
                  setSaved(false);
                }}
                rows={2}
                placeholder="Deskripsi untuk hasil pencarian Google. Kosongkan untuk memakai ringkasan."
              />
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
