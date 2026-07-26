import type { Metadata } from "next";
import { MapPin, Mail, MessageCircle } from "lucide-react";

import { getSettings } from "@/db/queries/settings";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Markaz Fiqih melalui alamat, email, atau WhatsApp.",
};

export default async function KontakPage() {
  const settings = await getSettings([
    "address",
    "whatsapp_number",
    "whatsapp_url",
    "email",
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="max-w-3xl">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Kontak
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Silakan hubungi kami melalui informasi berikut.
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {settings.address && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  Alamat
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {settings.address}
                </p>
              </div>
            </div>
          )}

          {settings.whatsapp_url && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  WhatsApp Admin
                </p>
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                >
                  {settings.whatsapp_number ?? "Hubungi via WhatsApp"}
                </a>
              </div>
            </div>
          )}

          {settings.email && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
