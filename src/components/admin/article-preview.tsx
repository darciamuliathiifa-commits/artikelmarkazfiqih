import Image from "next/image";

import { Badge } from "@/components/ui/badge";

export function ArticlePreview({
  title,
  thumbnailUrl,
  categoryName,
  authorName,
  authorAvatarUrl,
  contentHtml,
}: {
  title: string;
  thumbnailUrl: string;
  categoryName?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  contentHtml: string;
}) {
  return (
    <div className="rounded-xl border border-input p-4 sm:p-6">
      {categoryName && (
        <Badge variant="secondary" className="text-xs">
          {categoryName}
        </Badge>
      )}

      <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        {title || "Judul artikel belum diisi"}
      </h1>

      {authorName && (
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
          {authorAvatarUrl && (
            <Image
              src={authorAvatarUrl}
              alt={authorName}
              width={28}
              height={28}
              className="size-7 rounded-full object-cover"
            />
          )}
          {authorName}
        </div>
      )}

      {thumbnailUrl && (
        <div className="relative mt-6 aspect-16/9 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {contentHtml ? (
        <div
          className="article-content mt-6"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Konten artikel belum diisi.
        </p>
      )}
    </div>
  );
}
