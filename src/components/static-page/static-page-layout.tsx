import { formatDate } from "@/lib/format";
import { extractToc } from "@/lib/toc";
import { addImageCaptions } from "@/lib/image-captions";
import { ArticleToc } from "@/components/article/article-toc";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";

export function StaticPageLayout({
  title,
  updatedAt,
  content,
}: {
  title: string;
  updatedAt: string;
  content: string;
}) {
  const { html, toc } = extractToc(content);
  const contentHtml = addImageCaptions(html);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <header className="border-b border-border pb-5">
            <h1 className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Terakhir diperbarui: {formatDate(updatedAt)}
            </p>
          </header>

          <ArticleToc
            items={toc}
            className="mt-6 rounded-lg border border-border border-l-primary/40 bg-muted/40 py-4 pr-4"
          />

          <div
            className="article-content mt-8"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
