export type TocItem = { id: string; text: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seenIds = new Map<string, number>();

  const htmlWithIds = html.replace(
    /<h2([^>]*)>(.*?)<\/h2>/g,
    (_match, attrs: string, inner: string) => {
      const plainText = inner.replace(/<[^>]+>/g, "").trim();
      let id = slugify(plainText);
      const count = seenIds.get(id) ?? 0;
      seenIds.set(id, count + 1);
      if (count > 0) id = `${id}-${count}`;

      toc.push({ id, text: plainText });
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    }
  );

  return { html: htmlWithIds, toc };
}
