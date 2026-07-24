import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "s",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "hr",
  "sup",
  "div",
  "span",
];

const TEXT_ALIGN_VALUES: [RegExp] = [/^(left|center|right|justify)$/];

export function sanitizeArticleContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      p: ["class", "dir", "lang", "style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      h5: ["style"],
      h6: ["style"],
      sup: ["class", "data-footnote", "data-note"],
      div: ["class", "data-callout", "data-variant"],
      span: ["class", "dir", "lang"],
    },
    allowedStyles: {
      "*": { "text-align": TEXT_ALIGN_VALUES },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https", "data", "blob"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}
