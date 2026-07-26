"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, UploadCloud, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Media } from "@/db/schema";

export function MediaGalleryDialog({
  open,
  onOpenChange,
  onInsert,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (image: { src: string; alt: string }) => void;
}) {
  const [selectedUrl, setSelectedUrl] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [alt, setAlt] = useState("");
  const [gallery, setGallery] = useState<Media[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUrl = uploadedUrl || manualUrl.trim() || selectedUrl;

  useEffect(() => {
    if (!open) return;

    const timeoutId = setTimeout(() => {
      setGalleryLoading(true);
      fetch("/api/media")
        .then((res) => res.json())
        .then((data) => setGallery(data.media ?? []))
        .catch(() => setGallery([]))
        .finally(() => setGalleryLoading(false));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [open]);

  const reset = () => {
    setSelectedUrl("");
    setManualUrl("");
    setUploadedUrl("");
    setUploadedFileName("");
    setUploading(false);
    setUploadError("");
    setAlt("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setSelectedUrl("");
    setManualUrl("");
    setUploadedUrl("");
    setUploadError("");
    setUploading(true);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? "Gagal mengunggah gambar");
      }

      setUploadedUrl(data.media.url);
      setGallery((current) => [data.media, ...current]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal mengunggah gambar");
      setUploadedFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleInsert = () => {
    if (!activeUrl) return;
    onInsert({ src: activeUrl, alt });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sisipkan Gambar</DialogTitle>
          <DialogDescription>
            Unggah gambar baru, pilih dari galeri, atau tempel URL gambar secara langsung.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="upload">Unggah</TabsTrigger>
            <TabsTrigger value="gallery">Galeri</TabsTrigger>
            <TabsTrigger value="url">URL Gambar</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="flex flex-col gap-3 py-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input px-4 py-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Mengunggah {uploadedFileName}...
                    </span>
                  </>
                ) : uploadedUrl ? (
                  <>
                    <div className="relative aspect-video w-full max-w-52 overflow-hidden rounded-lg">
                      <Image
                        src={uploadedUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {uploadedFileName} &middot; klik untuk ganti
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="size-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Klik untuk memilih gambar dari perangkat
                    </span>
                  </>
                )}
              </button>
              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFileSelect(event.target.files?.[0])}
              />
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            {galleryLoading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : gallery.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Belum ada gambar yang diunggah.
              </p>
            ) : (
              <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto py-1">
                {gallery.map((image) => (
                  <button
                    type="button"
                    key={image.id}
                    onClick={() => {
                      setSelectedUrl(image.url);
                      setManualUrl("");
                      setUploadedUrl("");
                    }}
                    className={cn(
                      "relative aspect-video overflow-hidden rounded-lg ring-2 ring-transparent transition-all",
                      selectedUrl === image.url && "ring-primary"
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt ?? ""}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="url">
            <div className="flex flex-col gap-1.5 py-1">
              <Label htmlFor="manual-image-url">URL Gambar</Label>
              <Input
                id="manual-image-url"
                type="url"
                value={manualUrl}
                onChange={(event) => {
                  setManualUrl(event.target.value);
                  setSelectedUrl("");
                  setUploadedUrl("");
                }}
                placeholder="https://..."
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image-alt">Teks Alternatif (Alt)</Label>
          <Input
            id="image-alt"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Deskripsi singkat gambar"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
          >
            Batal
          </Button>
          <Button type="button" disabled={!activeUrl} onClick={handleInsert}>
            <ImagePlus className="size-4" />
            Sisipkan Gambar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
