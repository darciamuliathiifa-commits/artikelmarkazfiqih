"use client";

import { useSyncExternalStore } from "react";
import { CheckCircle2, Download, Monitor, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    // Diisi oleh skrip di root layout, karena event ini bisa terpicu sebelum
    // halaman /aplikasi dibuka.
    __installPrompt?: InstallPromptEvent | null;
  }
}

const steps = [
  {
    icon: Smartphone,
    title: "Android (Chrome)",
    items: [
      "Buka markazfiqih.com di Chrome.",
      "Ketuk ikon titik tiga (⋮) di pojok kanan atas.",
      "Pilih “Tambahkan ke layar utama” atau “Instal aplikasi”.",
    ],
  },
  {
    icon: Smartphone,
    title: "iPhone / iPad (Safari)",
    items: [
      "Buka markazfiqih.com di Safari.",
      "Ketuk tombol Bagikan (kotak dengan panah ke atas).",
      "Pilih “Tambah ke Layar Utama”, lalu ketuk “Tambah”.",
    ],
  },
  {
    icon: Monitor,
    title: "Komputer (Chrome / Edge)",
    items: [
      "Buka markazfiqih.com di Chrome atau Edge.",
      "Klik ikon instal di ujung kanan kolom alamat.",
      "Klik “Instal”.",
    ],
  },
];

const CHANGE_EVENT = "installpromptchange";
let installedNow = false;

function subscribe(onChange: () => void) {
  const onInstalled = () => {
    installedNow = true;
    window.__installPrompt = null;
    onChange();
  };
  const media = window.matchMedia("(display-mode: standalone)");
  window.addEventListener("beforeinstallprompt", onChange);
  window.addEventListener("appinstalled", onInstalled);
  window.addEventListener(CHANGE_EVENT, onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("beforeinstallprompt", onChange);
    window.removeEventListener("appinstalled", onInstalled);
    window.removeEventListener(CHANGE_EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

export function InstallApp() {
  const prompt = useSyncExternalStore(
    subscribe,
    () => window.__installPrompt ?? null,
    () => null
  );
  const installed = useSyncExternalStore(
    subscribe,
    () =>
      installedNow ||
      window.matchMedia("(display-mode: standalone)").matches,
    () => false
  );

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") installedNow = true;
    window.__installPrompt = null;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <div className="flex flex-col gap-6">
      {installed ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 p-5 text-sm text-foreground">
          <CheckCircle2 className="size-5 shrink-0 text-green-600" />
          Aplikasi Markaz Fiqih sudah terpasang di perangkat ini.
        </div>
      ) : prompt ? (
        <div className="rounded-xl border border-border bg-secondary/40 p-5">
          <Button size="lg" onClick={handleInstall}>
            <Download className="size-4" />
            Pasang Aplikasi
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Aplikasi akan muncul di layar utama perangkat Anda.
          </p>
        </div>
      ) : null}

      <div>
        <h2 className="font-heading text-lg font-bold text-foreground">
          Cara memasang
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-foreground">
                <step.icon className="size-4 text-primary" />
                {step.title}
              </div>
              <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                {step.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
