import { stripHtml } from "@/lib/text";

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Teks polos dari HTML editor, untuk kartu ringkas dan meta description. */
export function htmlToPlainText(html: string) {
  return stripHtml(html).replace(
    /&(amp|lt|gt|quot|#39|nbsp);/g,
    (entity) => ENTITIES[entity]
  );
}

/** Editor yang dikosongkan tetap menyimpan "<p></p>"; anggap itu kosong. */
export function isEmptyHtml(html: string | null | undefined) {
  if (!html) return true;
  return !htmlToPlainText(html) && !/<img\b/i.test(html);
}

/**
 * Deskripsi agenda dulu disimpan sebagai teks polos (textarea), sekarang HTML
 * dari editor. Teks lama diubah jadi paragraf supaya tampil dan bisa diedit.
 */
export function plainTextToHtml(value: string) {
  if (/^\s*</.test(value)) return value;

  return value
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
