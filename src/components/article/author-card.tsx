import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

import type { AuthorProfile } from "@/lib/data/authors";
import { FacebookIcon } from "@/components/icons/social-icons";

export function AuthorCard({ author }: { author: AuthorProfile }) {
  const socials = [
    { label: "Website", href: author.websiteUrl, icon: Globe },
    { label: "Facebook", href: author.facebookUrl, icon: FacebookIcon },
  ].filter((social) => social.href);

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
      <Image
        src={author.avatarUrl}
        alt={author.name}
        width={72}
        height={72}
        className="size-18 shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1.5">
        <Link
          href={`/kontributor/${author.slug}`}
          className="font-heading text-base font-bold text-foreground hover:text-primary"
        >
          {author.name}
        </Link>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {author.bio}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <Link
            href={`/kontributor/${author.slug}`}
            className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Lihat profil & tulisan lainnya
            <ArrowRight className="size-3.5" />
          </Link>

          {socials.length > 0 && (
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
