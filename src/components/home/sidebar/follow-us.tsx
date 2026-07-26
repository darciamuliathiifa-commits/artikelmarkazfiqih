import { MessageCircle } from "lucide-react";

import { getSiteChromeData } from "@/lib/data/site";
import {
  TikTokIcon,
  YoutubeIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/icons/social-icons";

export async function FollowUs() {
  const { footer } = await getSiteChromeData();

  const socials = [
    { label: "YouTube", href: footer.youtubeUrl, icon: YoutubeIcon },
    { label: "Facebook", href: footer.facebookUrl, icon: FacebookIcon },
    { label: "Instagram", href: footer.instagramUrl, icon: InstagramIcon },
    { label: "TikTok", href: footer.tiktokUrl, icon: TikTokIcon },
    { label: "WhatsApp", href: footer.whatsappUrl, icon: MessageCircle },
  ].filter((social) => social.href);

  if (socials.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Ikuti Kami
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <social.icon className="size-4 shrink-0" />
            {social.label}
          </a>
        ))}
      </div>
    </div>
  );
}
