import Link from "next/link";
import Image from "next/image";

import { getContributorsWithCount } from "@/lib/data/authors";

export async function TopAuthors() {
  const contributors = await getContributorsWithCount();
  const top = [...contributors]
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 4);

  if (top.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Kontributor Teratas
      </h2>
      <ul className="flex flex-col gap-3">
        {top.map((author, index) => (
          <li key={author.slug}>
            <Link
              href={`/kontributor/${author.slug}`}
              className="group flex items-center gap-3"
            >
              <span className="w-4 shrink-0 text-sm font-bold text-muted-foreground">
                {index + 1}
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {author.articleCount} artikel
                </span>
              </span>
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={36}
                height={36}
                className="size-9 shrink-0 rounded-full object-cover"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
