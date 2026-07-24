"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QnaTopic } from "@/db/schema";

export function KirimPertanyaanForm({ topics }: { topics: QnaTopic[] }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!city.trim() || !question.trim()) {
      setError("Kota dan pertanyaan wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/pertanyaan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, question, topic, consent }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal mengirim pertanyaan");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengirim pertanyaan"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary/40 p-8 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-heading text-lg font-bold text-foreground">
          Pertanyaan Terkirim
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          Terima kasih, pertanyaan Anda telah kami terima dan akan dijawab
          oleh tim redaksi Markaz Fiqih.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setName("");
            setCity("");
            setQuestion("");
            setTopic("");
            setConsent(false);
          }}
        >
          Kirim Pertanyaan Lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama lengkap, atau kosongkan untuk Anonim"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="city">
          Kota Tempat Tinggal <span className="text-primary">*</span>
        </Label>
        <Input
          id="city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Contoh: Tangerang"
          required
        />
      </div>

      {topics.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="topic">Topik</Label>
          <Select
            items={topics.map((item) => ({ value: item.name, label: item.name }))}
            value={topic}
            onValueChange={(value) => setTopic(value ?? "")}
          >
            <SelectTrigger id="topic" className="w-full">
              <SelectValue placeholder="Pilih topik (opsional)" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="question">
          Pertanyaan <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Tuliskan pertanyaan Anda seputar fiqih di sini..."
          rows={6}
          required
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
        />
        <Label htmlFor="consent" className="font-normal text-muted-foreground">
          Saya menyetujui pertanyaan ini boleh dipublikasikan pada halaman
          Tanya Jawab.
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" disabled={submitting} className="w-fit">
        {submitting ? "Mengirim..." : "Kirim Pertanyaan"}
      </Button>
    </form>
  );
}
