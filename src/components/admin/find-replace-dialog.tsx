"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Replaces occurrences only within text segments of an HTML string, leaving tags/attributes untouched. */
function replaceInHtmlText(html: string, search: string, replacement: string) {
  const pattern = new RegExp(escapeRegExp(search), "gi");
  let count = 0;
  const result = html.replace(/(>)([^<]*)(<)/g, (_match, open, text, close) => {
    const replaced = text.replace(pattern, () => {
      count += 1;
      return replacement;
    });
    return `${open}${replaced}${close}`;
  });
  return { result, count };
}

export function FindReplaceDialog({
  open,
  onOpenChange,
  editor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor | null;
}) {
  const [search, setSearch] = useState("");
  const [replacement, setReplacement] = useState("");
  const [message, setMessage] = useState("");

  const handleReplaceAll = () => {
    if (!editor || !search.trim()) return;

    const html = editor.getHTML();
    const { result, count } = replaceInHtmlText(html, search, replacement);

    if (count === 0) {
      setMessage("Tidak ditemukan.");
      return;
    }

    editor.commands.setContent(result, { emitUpdate: true });
    setMessage(`${count} kemunculan diganti.`);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setSearch("");
          setReplacement("");
          setMessage("");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cari &amp; Ganti</DialogTitle>
          <DialogDescription>
            Mengganti semua kemunculan teks pada isi artikel.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="find-text-input">Cari</Label>
            <Input
              id="find-text-input"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setMessage("");
              }}
              placeholder="Teks yang dicari"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="replace-text-input">Ganti dengan</Label>
            <Input
              id="replace-text-input"
              value={replacement}
              onChange={(event) => {
                setReplacement(event.target.value);
                setMessage("");
              }}
              placeholder="Teks pengganti"
            />
          </div>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleReplaceAll}
            disabled={!search.trim()}
          >
            Ganti Semua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
