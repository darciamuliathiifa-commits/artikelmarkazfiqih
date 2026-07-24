const LIMITS = {
  title: 200,
  excerpt: 500,
  metaDescription: 300,
};

export function validateArticleFields(body: Record<string, unknown>): string | null {
  if (typeof body.title === "string") {
    if (!body.title.trim()) return "title tidak boleh kosong";
    if (body.title.length > LIMITS.title)
      return `title maksimal ${LIMITS.title} karakter`;
  }

  if (typeof body.excerpt === "string") {
    if (!body.excerpt.trim()) return "excerpt tidak boleh kosong";
    if (body.excerpt.length > LIMITS.excerpt)
      return `excerpt maksimal ${LIMITS.excerpt} karakter`;
  }

  if (typeof body.content === "string" && !body.content.trim()) {
    return "content tidak boleh kosong";
  }

  if (
    typeof body.metaDescription === "string" &&
    body.metaDescription.length > LIMITS.metaDescription
  ) {
    return `metaDescription maksimal ${LIMITS.metaDescription} karakter`;
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((tag) => typeof tag !== "string")) {
      return "tags harus berupa array string";
    }
  }

  return null;
}
