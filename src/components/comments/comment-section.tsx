"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export type PublicComment = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

export function CommentSection({
  comments,
  articleSlug,
  qnaSlug,
}: {
  comments: PublicComment[];
  articleSlug?: string;
  qnaSlug?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !content.trim()) {
      setError("Nama, email, dan komentar wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          content,
          website,
          articleSlug,
          qnaSlug,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal mengirim komentar");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim komentar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="relative inline-block pb-2 font-heading text-lg font-bold text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
        Komentar {comments.length > 0 && `(${comments.length})`}
      </h2>

      {comments.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-xl border border-border bg-secondary/40 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading text-sm font-semibold text-foreground">
                  {comment.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="size-4" />
          Belum ada komentar. Jadilah yang pertama berkomentar.
        </p>
      )}

      <div className="mt-6 rounded-xl border border-border p-5">
        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <CheckCircle2 className="size-8 text-primary" />
            <p className="font-heading text-sm font-bold text-foreground">
              Komentar Terkirim
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Terima kasih, komentar Anda akan tampil setelah disetujui oleh
              tim redaksi Markaz Fiqih.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              Kirim Komentar Lain
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="font-heading text-sm font-semibold text-foreground">
              Tinggalkan Komentar
            </p>

            <input
              type="text"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="comment-name">
                  Nama <span className="text-primary">*</span>
                </Label>
                <Input
                  id="comment-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nama Anda"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="comment-email">
                  Email <span className="text-primary">*</span>
                </Label>
                <Input
                  id="comment-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@contoh.com"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="comment-content">
                Komentar <span className="text-primary">*</span>
              </Label>
              <Textarea
                id="comment-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Tuliskan komentar Anda..."
                rows={4}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-fit">
              {submitting ? "Mengirim..." : "Kirim Komentar"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
