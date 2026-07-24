const LIMITS = {
  title: 200,
  question: 2000,
};

export function validateQnaFields(body: Record<string, unknown>): string | null {
  if (typeof body.title === "string") {
    if (!body.title.trim()) return "title tidak boleh kosong";
    if (body.title.length > LIMITS.title)
      return `title maksimal ${LIMITS.title} karakter`;
  }

  if (typeof body.question === "string") {
    if (!body.question.trim()) return "question tidak boleh kosong";
    if (body.question.length > LIMITS.question)
      return `question maksimal ${LIMITS.question} karakter`;
  }

  if (typeof body.answer === "string" && !body.answer.trim()) {
    return "answer tidak boleh kosong";
  }

  return null;
}
