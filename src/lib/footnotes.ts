export type FootnoteItem = { id: string; text: string };

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export function extractFootnotes(html: string): {
  html: string;
  footnotes: FootnoteItem[];
} {
  const footnotes: FootnoteItem[] = [];
  let index = 0;

  const htmlWithRefs = html.replace(
    /<sup\b([^>]*)>[\s\S]*?<\/sup>/g,
    (match, attrs: string) => {
      if (!/data-footnote/.test(attrs)) return match;

      const noteMatch = attrs.match(/data-note="([^"]*)"/);
      const rawText = noteMatch ? noteMatch[1] : "";

      index += 1;
      const id = `fn-${index}`;
      footnotes.push({ id, text: decodeHtmlEntities(rawText) });

      return `<sup class="footnote-ref" id="fnref-${index}"><a href="#${id}">[${index}]</a></sup>`;
    }
  );

  return { html: htmlWithRefs, footnotes };
}
