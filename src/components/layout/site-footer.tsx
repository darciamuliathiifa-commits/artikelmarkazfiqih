import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Logo } from "@/components/logo";
import {
  TikTokIcon,
  YoutubeIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/icons/social-icons";

const quickLinks = [
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Donasi", href: "/donasi" },
  { label: "Kontak", href: "/kontak" },
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export type FooterData = {
  address: string;
  tagline: string;
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;
};

export function SiteFooter({ footer }: { footer: FooterData }) {
  const socials = [
    { label: "YouTube", href: footer.youtubeUrl, icon: YoutubeIcon },
    { label: "Facebook", href: footer.facebookUrl, icon: FacebookIcon },
    { label: "Instagram", href: footer.instagramUrl, icon: InstagramIcon },
    { label: "TikTok", href: footer.tiktokUrl, icon: TikTokIcon },
    { label: "WhatsApp Admin", href: footer.whatsappUrl, icon: MessageCircle },
  ].filter((social) => social.href);

  return (
    <footer className="border-t border-black/20 bg-primary text-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Logo variant="white" height={32} />
          </Link>
          <p className="text-sm text-white/70">{footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-sm font-semibold text-white">
            Alamat
          </h3>
          <p className="text-sm leading-relaxed text-white/70">
            {footer.address}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-sm font-semibold text-white">
            Menu
          </h3>
          <ul className="flex flex-col gap-1.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-sm font-semibold text-white">
            Ikuti Kami
          </h3>
          <ul className="flex flex-col gap-2">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
                >
                  <social.icon className="size-4" />
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Markaz Fiqih. Seluruh hak cipta
            dilindungi.
          </p>
          <p className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
            markazfiqih.com
          </p>
        </div>
      </div>
    </footer>
  );
}
