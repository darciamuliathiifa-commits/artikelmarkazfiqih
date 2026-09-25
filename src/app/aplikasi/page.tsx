import type { Metadata } from "next";

import { InstallApp } from "@/components/aplikasi/install-app";

export const metadata: Metadata = {
  title: "Aplikasi",
  description:
    "Pasang Markaz Fiqih sebagai aplikasi di HP atau komputer agar lebih cepat dibuka.",
};

export default function AppPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="max-w-3xl">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Aplikasi Markaz Fiqih
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Pasang Markaz Fiqih di layar utama HP atau komputer Anda. Buka
          artikel, tanya jawab, dan agenda langsung dari ikon aplikasi, tanpa
          perlu mengetik alamat website. Gratis dan tidak memakan banyak
          memori.
        </p>

        <div className="mt-8">
          <InstallApp />
        </div>
      </div>
    </div>
  );
}
