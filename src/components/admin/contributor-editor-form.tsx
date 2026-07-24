"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { CheckCircle2, User, Upload, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaGalleryDialog } from "@/components/admin/media-gallery-dialog";

export type ContributorFormInitialValues = {
  slug: string;
  name: string;
  bio: string;
  longBio: string;
  avatarUrl: string;
  websiteUrl: string;
  facebookUrl: string;
};

export function ContributorEditorForm({
  initialValues,
}: {
  initialValues?: ContributorFormInitialValues;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [bio, setBio] = useState(initialValues?.bio ?? "");
  const [longBio, setLongBio] = useState(initialValues?.longBio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialValues?.avatarUrl ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(initialValues?.websiteUrl ?? "");
  const [facebookUrl, setFacebookUrl] = useState(initialValues?.facebookUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(false);

  const isEdit = Boolean(initialValues);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch(
        isEdit ? `/api/kontributor/${initialValues!.slug}` : "/api/kontributor",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            bio,
            longBio,
            avatarUrl,
            websiteUrl,
            facebookUrl,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menyimpan kontributor");
      }

      if (isEdit) {
        setSaved(true);
      } else {
        router.push("/admin/kontributor");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan kontributor"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSaved(false);
          }}
          placeholder="Nama lengkap kontributor"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Foto Profil</Label>
        <div className="flex items-center gap-4">
          <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {avatarUrl ? (
              <NextImage
                src={avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <User className="size-8 text-muted-foreground" />
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
              {avatarUrl ? "Ganti Foto" : "Unggah Foto"}
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAvatarUrl("");
                  setSaved(false);
                }}
              >
                <X className="size-3.5" />
                Hapus Foto
              </Button>
            )}
          </div>
        </div>
      </div>

      <MediaGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onInsert={({ src }) => {
          setAvatarUrl(src);
          setSaved(false);
        }}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio Singkat</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(event) => {
            setBio(event.target.value);
            setSaved(false);
          }}
          rows={2}
          placeholder="Ringkasan singkat yang tampil di bawah artikel"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="longBio">Biografi Panjang</Label>
        <Textarea
          id="longBio"
          value={longBio}
          onChange={(event) => {
            setLongBio(event.target.value);
            setSaved(false);
          }}
          rows={6}
          placeholder="Biografi lengkap yang tampil di halaman profil"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="websiteUrl">Website</Label>
        <Input
          id="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(event) => {
            setWebsiteUrl(event.target.value);
            setSaved(false);
          }}
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="facebookUrl">Facebook</Label>
        <Input
          id="facebookUrl"
          type="url"
          value={facebookUrl}
          onChange={(event) => {
            setFacebookUrl(event.target.value);
            setSaved(false);
          }}
          placeholder="https://facebook.com/..."
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kontributor"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <CheckCircle2 className="size-4" />
            Perubahan tersimpan
          </span>
        )}
      </div>
    </form>
  );
}
