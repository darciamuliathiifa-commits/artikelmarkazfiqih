"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function FootnoteDialog({
  open,
  onOpenChange,
  initialText,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialText: string;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState(initialText);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setText(initialText);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialText ? "Ubah Catatan Kaki" : "Sisipkan Catatan Kaki"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-1.5 py-2">
            <Label htmlFor="footnote-text-input">Isi Catatan</Label>
            <Textarea
              id="footnote-text-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={3}
              placeholder="Tuliskan catatan kaki di sini..."
              autoFocus
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              {initialText ? "Simpan" : "Sisipkan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
