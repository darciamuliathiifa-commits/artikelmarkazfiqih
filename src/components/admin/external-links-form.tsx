"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaGalleryDialog } from "@/components/admin/media-gallery-dialog";

type BannerSlot = 1 | 2 | 3;

const BANNER_SLOTS: { slot: BannerSlot; label: string }[] = [
  { slot: 1, label: "Rekomendasi" },
  { slot: 2, label: "Informasi" },
  { slot: 3, label: "Iklan" },
];

export function ExternalLinksForm({
  initialKelasUrl,
  initialAdBanner1ImageUrl,
  initialAdBanner1LinkUrl,
  initialAdBanner2ImageUrl,
  initialAdBanner2LinkUrl,
  initialAdBanner3ImageUrl,
  initialAdBanner3LinkUrl,
  initialAddress,
  initialWhatsappNumber,
  initialWhatsappUrl,
  initialEmail,
  initialYoutubeUrl,
  initialFacebookUrl,
  initialInstagramUrl,
  initialTiktokUrl,
}: {
  initialKelasUrl: string;
  initialAdBanner1ImageUrl: string;
  initialAdBanner1LinkUrl: string;
  initialAdBanner2ImageUrl: string;
  initialAdBanner2LinkUrl: string;
  initialAdBanner3ImageUrl: string;
  initialAdBanner3LinkUrl: string;
  initialAddress: string;
  initialWhatsappNumber: string;
  initialWhatsappUrl: string;
  initialEmail: string;
  initialYoutubeUrl: string;
  initialFacebookUrl: string;
  initialInstagramUrl: string;
  initialTiktokUrl: string;
}) {
  const [kelasUrl, setKelasUrl] = useState(initialKelasUrl);
  const [address, setAddress] = useState(initialAddress);
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsappNumber);
  const [whatsappUrl, setWhatsappUrl] = useState(initialWhatsappUrl);
  const [email, setEmail] = useState(initialEmail);
  const [youtubeUrl, setYoutubeUrl] = useState(initialYoutubeUrl);
  const [facebookUrl, setFacebookUrl] = useState(initialFacebookUrl);
  const [instagramUrl, setInstagramUrl] = useState(initialInstagramUrl);
  const [tiktokUrl, setTiktokUrl] = useState(initialTiktokUrl);
  const [bannerImages, setBannerImages] = useState<Record<BannerSlot, string>>({
    1: initialAdBanner1ImageUrl,
    2: initialAdBanner2ImageUrl,
    3: initialAdBanner3ImageUrl,
  });
  const [bannerLinks, setBannerLinks] = useState<Record<BannerSlot, string>>({
    1: initialAdBanner1LinkUrl,
    2: initialAdBanner2LinkUrl,
    3: initialAdBanner3LinkUrl,
  });
  const [bannerGalleryTarget, setBannerGalleryTarget] = useState<BannerSlot | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const updateBannerImage = (slot: BannerSlot, value: string) => {
    setBannerImages((prev) => ({ ...prev, [slot]: value }));
    setSaved(false);
  };

  const updateBannerLink = (slot: BannerSlot, value: string) => {
    setBannerLinks((prev) => ({ ...prev, [slot]: value }));
    setSaved(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/pengaturan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelas_url: kelasUrl,
          ad_banner_1_image_url: bannerImages[1],
          ad_banner_1_link_url: bannerLinks[1],
          ad_banner_2_image_url: bannerImages[2],
          ad_banner_2_link_url: bannerLinks[2],
          ad_banner_3_image_url: bannerImages[3],
          ad_banner_3_link_url: bannerLinks[3],
          address,
          whatsapp_number: whatsappNumber,
          whatsapp_url: whatsappUrl,
          email,
          youtube_url: youtubeUrl,
          facebook_url: facebookUrl,
          instagram_url: instagramUrl,
          tiktok_url: tiktokUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menyimpan pengaturan");
      }

      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="kelas-url">URL Menu Kelas</Label>
        <Input
          id="kelas-url"
          type="url"
          value={kelasUrl}
          onChange={(event) => {
            setKelasUrl(event.target.value);
            setSaved(false);
          }}
          placeholder="https://kelas.markazfiqih.com"
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Banner Iklan</Label>
        <p className="text-sm text-muted-foreground">
          Tiga banner ini tampil bersamaan di sidebar kanan halaman artikel,
          tanya jawab, agenda, dan kegiatan. Kosongkan gambar untuk
          menyembunyikan salah satu banner.
        </p>

        <div className="flex flex-col gap-3">
          {BANNER_SLOTS.map(({ slot, label }) => (
            <div
              key={slot}
              className="flex flex-col gap-3 rounded-xl border border-border p-3"
            >
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
              <div className="flex items-center gap-4">
                <div className="relative flex aspect-video w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                  {bannerImages[slot] ? (
                    <Image
                      src={bannerImages[slot]}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Tidak ada gambar
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBannerGalleryTarget(slot)}
                  >
                    <Upload className="size-3.5" />
                    {bannerImages[slot] ? "Ganti Gambar" : "Unggah Gambar"}
                  </Button>
                  {bannerImages[slot] && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateBannerImage(slot, "")}
                    >
                      Hapus Gambar
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`ad-banner-${slot}-link`}>
                  URL Tujuan (opsional)
                </Label>
                <Input
                  id={`ad-banner-${slot}-link`}
                  type="url"
                  value={bannerLinks[slot]}
                  onChange={(event) =>
                    updateBannerLink(slot, event.target.value)
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Kontak</Label>
        <p className="text-sm text-muted-foreground">
          Tampil di halaman Kontak. Kosongkan untuk menyembunyikan salah satu
          info.
        </p>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-address">Alamat</Label>
          <Textarea
            id="contact-address"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setSaved(false);
            }}
            rows={2}
            placeholder="Alamat kantor/sekretariat"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-whatsapp-number">
            Nomor WhatsApp (teks tampilan)
          </Label>
          <Input
            id="contact-whatsapp-number"
            value={whatsappNumber}
            onChange={(event) => {
              setWhatsappNumber(event.target.value);
              setSaved(false);
            }}
            placeholder="0812-3456-7890"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-whatsapp-url">URL WhatsApp</Label>
          <Input
            id="contact-whatsapp-url"
            type="url"
            value={whatsappUrl}
            onChange={(event) => {
              setWhatsappUrl(event.target.value);
              setSaved(false);
            }}
            placeholder="https://wa.me/6281234567890"
          />
          <p className="text-xs text-muted-foreground">
            Juga dipakai sebagai tautan WhatsApp Admin di blok Ikuti Kami.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSaved(false);
            }}
            placeholder="admin@markazfiqih.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Sosial Media</Label>
        <p className="text-sm text-muted-foreground">
          Tampil di blok Ikuti Kami dan footer. Kosongkan untuk menyembunyikan
          salah satu tautan.
        </p>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="social-youtube">URL YouTube</Label>
          <Input
            id="social-youtube"
            type="url"
            value={youtubeUrl}
            onChange={(event) => {
              setYoutubeUrl(event.target.value);
              setSaved(false);
            }}
            placeholder="https://youtube.com/@markazfiqih"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="social-facebook">URL Facebook</Label>
          <Input
            id="social-facebook"
            type="url"
            value={facebookUrl}
            onChange={(event) => {
              setFacebookUrl(event.target.value);
              setSaved(false);
            }}
            placeholder="https://facebook.com/markazfiqih"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="social-instagram">URL Instagram</Label>
          <Input
            id="social-instagram"
            type="url"
            value={instagramUrl}
            onChange={(event) => {
              setInstagramUrl(event.target.value);
              setSaved(false);
            }}
            placeholder="https://instagram.com/markazfiqih"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="social-tiktok">URL TikTok</Label>
          <Input
            id="social-tiktok"
            type="url"
            value={tiktokUrl}
            onChange={(event) => {
              setTiktokUrl(event.target.value);
              setSaved(false);
            }}
            placeholder="https://tiktok.com/@markazfiqih"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <CheckCircle2 className="size-4" />
            Perubahan tersimpan
          </span>
        )}
      </div>

      <MediaGalleryDialog
        open={bannerGalleryTarget !== null}
        onOpenChange={(open) => {
          if (!open) setBannerGalleryTarget(null);
        }}
        onInsert={({ src }) => {
          if (bannerGalleryTarget !== null) {
            updateBannerImage(bannerGalleryTarget, src);
          }
          setBannerGalleryTarget(null);
        }}
      />
    </form>
  );
}
