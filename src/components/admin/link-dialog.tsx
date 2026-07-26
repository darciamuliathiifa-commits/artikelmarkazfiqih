"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LinkDialog({
  open,
  onOpenChange,
  initialUrl,
  onSubmit,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialUrl: string;
  onSubmit: (url: string) => void;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setUrl(initialUrl);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = url.trim();
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
              {initialUrl ? "Ubah Link" : "Sisipkan Link"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-1.5 py-2">
            <Label htmlFor="link-url-input">URL</Label>
            <Input
              id="link-url-input"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://..."
              autoFocus
              required
            />
          </div>

          <DialogFooter>
            {initialUrl && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onRemove();
                  onOpenChange(false);
                }}
              >
                Hapus Link
              </Button>
            )}
            <Button type="submit">Sisipkan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
